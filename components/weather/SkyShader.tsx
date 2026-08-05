"use client";

import { useEffect, useRef } from "react";
import type { DayMoment, SkyCondition } from "@/data/weather";

/**
 * Nubes realistas con un fragment shader WebGL: ruido FBM con domain warping,
 * iluminación según el momento del día y glow de sol/luna. Los parámetros se
 * interpolan cada frame para transiciones suaves entre condiciones.
 */

type Vec3 = [number, number, number];

type Target = {
  coverage: number; // 0 = sin nubes, 1 = cubierto
  softness: number; // suavidad de los bordes
  speed: number; // velocidad de deriva
  light: Vec3; // color de la cara iluminada
  shadow: Vec3; // color de la cara en sombra
  glowColor: Vec3;
  glowPos: [number, number]; // uv (0..1), y hacia arriba
  glowStrength: number;
  disc: number; // 1 = dibuja el disco de la luna
  detail: number; // contraste de iluminación interior de la nube
};

const CONDITION_PARAMS: Record<
  SkyCondition,
  { coverage: number; softness: number; speed: number; brightness: number; glowMul: number; detail: number }
> = {
  despejado: { coverage: 0.16, softness: 0.3, speed: 0.6, brightness: 1.0, glowMul: 1.0, detail: 1.0 },
  nubes: { coverage: 0.55, softness: 0.26, speed: 1.0, brightness: 0.85, glowMul: 0.55, detail: 1.0 },
  lluvia: { coverage: 0.8, softness: 0.2, speed: 2.4, brightness: 0.48, glowMul: 0.12, detail: 0.3 },
  nieve: { coverage: 0.68, softness: 0.3, speed: 0.8, brightness: 0.82, glowMul: 0.45, detail: 0.55 },
};

const MOMENT_PARAMS: Record<
  DayMoment,
  { glowPos: [number, number]; glow: Vec3; glowStrength: number; light: Vec3; shadow: Vec3; disc: number }
> = {
  amanecer: {
    glowPos: [0.72, 0.3],
    glow: [1.0, 0.62, 0.38],
    glowStrength: 0.5,
    light: [1.0, 0.85, 0.75],
    shadow: [0.42, 0.38, 0.52],
    disc: 0,
  },
  dia: {
    glowPos: [0.8, 0.88],
    glow: [1.0, 0.97, 0.85],
    glowStrength: 0.38,
    light: [1.0, 1.0, 1.0],
    shadow: [0.55, 0.62, 0.75],
    disc: 0,
  },
  atardecer: {
    glowPos: [0.25, 0.28],
    glow: [1.0, 0.5, 0.28],
    glowStrength: 0.55,
    light: [1.0, 0.72, 0.55],
    shadow: [0.4, 0.32, 0.45],
    disc: 0,
  },
  noche: {
    glowPos: [0.78, 0.82],
    glow: [0.75, 0.82, 1.0],
    glowStrength: 0.28,
    light: [0.5, 0.56, 0.72],
    shadow: [0.16, 0.19, 0.3],
    disc: 1,
  },
};

function targetFor(moment: DayMoment, condition: SkyCondition): Target {
  const c = CONDITION_PARAMS[condition];
  const m = MOMENT_PARAMS[moment];
  return {
    coverage: c.coverage,
    softness: c.softness,
    speed: c.speed,
    light: m.light.map((v) => v * c.brightness) as Vec3,
    shadow: m.shadow.map((v) => v * c.brightness) as Vec3,
    glowColor: m.glow,
    glowPos: m.glowPos,
    glowStrength: m.glowStrength * c.glowMul,
    disc: m.disc,
    detail: c.detail,
  };
}

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform float uCoverage;
uniform float uSoftness;
uniform vec3 uLight;
uniform vec3 uShadow;
uniform vec3 uGlowColor;
uniform vec2 uGlowPos;
uniform float uGlowStrength;
uniform float uDisc;
uniform float uDetail;

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 r = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = r * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime * 0.03;

  // Masas grandes con deriva lenta; warp suave a frecuencia alta para
  // billows algodonosos en los bordes en vez de turbulencia
  vec2 q = vec2(
    fbm(p * 1.15 + vec2(t, 0.0)),
    fbm(p * 1.15 + vec2(5.2 + t * 0.6, 1.3))
  );
  vec2 r = vec2(
    fbm(p * 3.1 + 1.3 * q + vec2(1.7 + t * 1.2, 9.2)),
    fbm(p * 3.1 + 1.3 * q + vec2(8.3, 2.8 + t * 0.9))
  );
  float f = fbm(p * 1.5 + 1.6 * r);

  // Más densidad hacia arriba; la zona baja queda despejada para el contenido
  float hf = mix(0.35, 1.0, smoothstep(0.08, 0.9, uv.y));
  float density = f * hf;
  float lo = (1.0 - uCoverage) * 0.75;
  float cov = smoothstep(lo, lo + uSoftness, density);
  cov = pow(cov, 1.4); // afina los semitonos: cúmulos con huecos de cielo limpios

  // Pseudo-iluminación: derivada del ruido hacia la fuente de luz
  vec2 ldir = normalize(vec2(uGlowPos.x * aspect, uGlowPos.y) - p + vec2(0.001));
  float fL = fbm(p * 1.5 + 1.6 * r + ldir * 0.14);
  float lit = clamp((f - fL) * 2.5 * uDetail + 0.55, 0.0, 1.0);
  vec3 cloudCol = mix(uShadow, uLight, lit);

  // Borde plateado en los filos de la nube
  float rim = smoothstep(0.0, 0.25, cov) * (1.0 - smoothstep(0.25, 0.75, cov));
  cloudCol += uLight * rim * 0.25 * uDetail;

  // Glow de sol / luna
  float d = distance(p, vec2(uGlowPos.x * aspect, uGlowPos.y));
  float glow = exp(-d * 3.2) * uGlowStrength;
  float disc = smoothstep(0.045, 0.032, d) * uDisc;

  vec3 col = cloudCol * cov
    + uGlowColor * glow * (1.0 - cov * 0.5)
    + vec3(0.92, 0.95, 1.0) * disc * (1.0 - cov);
  float alpha = clamp(cov * 0.94 + glow * 0.85 + disc, 0.0, 1.0);

  gl_FragColor = vec4(col, alpha);
}
`;

type Props = {
  moment: DayMoment;
  condition: SkyCondition;
  /** true = un solo frame estático (prefers-reduced-motion) */
  frozen?: boolean;
  onUnavailable?: () => void;
};

export default function SkyShader({ moment, condition, frozen = false, onUnavailable }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetRef = useRef<Target>(targetFor(moment, condition));
  const frozenRef = useRef(frozen);
  const cbRef = useRef(onUnavailable);
  const renderOnceRef = useRef<(() => void) | null>(null);
  const restartRef = useRef<(() => void) | null>(null);

  // Los refs se sincronizan en efecto, nunca durante el render
  useEffect(() => {
    targetRef.current = targetFor(moment, condition);
    frozenRef.current = frozen;
    cbRef.current = onUnavailable;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
    });
    if (!gl) {
      cbRef.current?.();
      return;
    }

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      cbRef.current?.();
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      cbRef.current?.();
      return;
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uCoverage = u("uCoverage");
    const uSoftness = u("uSoftness");
    const uLight = u("uLight");
    const uShadow = u("uShadow");
    const uGlowColor = u("uGlowColor");
    const uGlowPos = u("uGlowPos");
    const uGlowStrength = u("uGlowStrength");
    const uDisc = u("uDisc");
    const uDetail = u("uDetail");

    const dprCap = 1.5;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // Estado actual: arranca en el target para evitar transición al montar
    const cur: Target = { ...targetRef.current };
    let simTime = 40; // fase arbitraria para no empezar en un patrón reconocible
    let raf = 0;
    let last = performance.now();

    const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = targetRef.current;
      const k = 1 - Math.exp(-dt * 2.2); // transición ~0.9s, como el degradado

      cur.coverage = lerp(cur.coverage, t.coverage, k);
      cur.softness = lerp(cur.softness, t.softness, k);
      cur.speed = lerp(cur.speed, t.speed, k);
      cur.glowStrength = lerp(cur.glowStrength, t.glowStrength, k);
      cur.disc = lerp(cur.disc, t.disc, k);
      cur.detail = lerp(cur.detail, t.detail, k);
      for (let i = 0; i < 3; i++) {
        cur.light[i] = lerp(cur.light[i], t.light[i], k);
        cur.shadow[i] = lerp(cur.shadow[i], t.shadow[i], k);
        cur.glowColor[i] = lerp(cur.glowColor[i], t.glowColor[i], k);
      }
      cur.glowPos[0] = lerp(cur.glowPos[0], t.glowPos[0], k);
      cur.glowPos[1] = lerp(cur.glowPos[1], t.glowPos[1], k);

      if (!frozenRef.current) simTime += dt * cur.speed;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, simTime);
      gl.uniform1f(uCoverage, cur.coverage);
      gl.uniform1f(uSoftness, cur.softness);
      gl.uniform3fv(uLight, cur.light);
      gl.uniform3fv(uShadow, cur.shadow);
      gl.uniform3fv(uGlowColor, cur.glowColor);
      gl.uniform2f(uGlowPos, cur.glowPos[0], cur.glowPos[1]);
      gl.uniform1f(uGlowStrength, cur.glowStrength);
      gl.uniform1f(uDisc, cur.disc);
      gl.uniform1f(uDetail, cur.detail);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!frozenRef.current) raf = requestAnimationFrame(render);
    };

    renderOnceRef.current = () => {
      last = performance.now();
      // En modo estático forzamos convergencia inmediata al target
      Object.assign(cur, {
        ...targetRef.current,
        light: [...targetRef.current.light],
        shadow: [...targetRef.current.shadow],
        glowColor: [...targetRef.current.glowColor],
        glowPos: [...targetRef.current.glowPos],
      });
      render(last);
    };

    restartRef.current = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(render);
    };

    if (frozen) {
      renderOnceRef.current();
    } else {
      raf = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(raf);
      renderOnceRef.current = null;
      restartRef.current = null;
      window.removeEventListener("resize", resize);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
    // frozen se lee por ref dentro del loop; el efecto solo se monta una vez
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Con movimiento reducido, re-renderiza un frame estático al cambiar el
  // cielo; al salir de ese modo, reanuda el loop de animación
  useEffect(() => {
    if (frozen) {
      renderOnceRef.current?.();
    } else {
      restartRef.current?.();
    }
  }, [frozen, moment, condition]);

  return <canvas ref={canvasRef} className="sky__gl" />;
}
