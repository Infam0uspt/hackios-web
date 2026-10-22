"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// Oosy, built from primitives and drawn through a red LED dot-matrix pass.
// The canvas sizes itself to its parent box, so on phones the box can sit in the normal flow.
export default function Mascot({ label }: { label: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = boxRef.current!, canvas = canvasRef.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      box.classList.add("no-gl");
      return;
    }
    const DPR = Math.min(devicePixelRatio || 1, 2);
    renderer.setPixelRatio(DPR);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(-3, 5, 6); scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 1.8); rim.position.set(4, 2, -5); scene.add(rim);
    const fillL = new THREE.DirectionalLight(0xffffff, 0.5); fillL.position.set(4, -1, 4); scene.add(fillL);

    const skin = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 });
    const voidM = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const M = (geo: THREE.BufferGeometry, mat: THREE.Material = skin) => new THREE.Mesh(geo, mat);

    const rig = new THREE.Group(); scene.add(rig);
    const bodyG = new THREE.Group(); rig.add(bodyG);
    const body = M(new THREE.CapsuleGeometry(0.6, 0.55, 10, 28)); body.position.y = 1.05; body.scale.set(1, 1, 0.86); bodyG.add(body);
    const pocket = M(new THREE.TorusGeometry(0.42, 0.018, 6, 40, Math.PI), voidM);
    pocket.position.set(0, 0.88, 0.5); pocket.rotation.set(0.25, 0, Math.PI); pocket.scale.set(1, 0.5, 1); bodyG.add(pocket);
    const hood = M(new THREE.TorusGeometry(0.5, 0.11, 12, 40)); hood.position.set(0, 1.62, -0.05); hood.rotation.x = Math.PI / 2 - 0.25; hood.scale.set(1, 1.05, 0.8); bodyG.add(hood);

    const headG = new THREE.Group(); headG.position.y = 1.8; bodyG.add(headG);
    const head = M(new THREE.SphereGeometry(0.9, 56, 40)); head.position.y = 0.62; head.scale.set(1.08, 0.97, 0.96); headG.add(head);
    const eyes: THREE.Group[] = [];
    for (const s of [-1, 1]) {
      const eg = new THREE.Group(); eg.position.set(s * 0.32, 0.66, 0.8); eg.rotation.y = s * 0.36; headG.add(eg);
      const e = M(new THREE.CapsuleGeometry(0.11, 0.12, 6, 16), voidM); e.scale.set(1, 1, 0.45); eg.add(e);
      const glint = M(new THREE.SphereGeometry(0.04, 12, 10)); glint.position.set(-0.04, 0.09, 0.06); eg.add(glint);
      eyes.push(eg);
    }
    const mouth = M(new THREE.TorusGeometry(0.2, 0.03, 8, 30, Math.PI * 0.8), voidM);
    mouth.position.set(0, 0.32, 0.86); mouth.rotation.set(-0.25, 0, Math.PI + Math.PI * 0.1); headG.add(mouth);
    const fang = M(new THREE.ConeGeometry(0.045, 0.12, 10)); fang.position.set(0.09, 0.17, 0.88); fang.rotation.x = Math.PI; headG.add(fang);
    const horns: { g: THREE.Group; s: number }[] = [];
    for (const s of [-1, 1]) {
      const hg = new THREE.Group(); hg.position.set(s * 0.42, 1.28, 0); hg.rotation.z = -s * 0.5; headG.add(hg);
      const cone = M(new THREE.ConeGeometry(0.15, 0.72, 24)); cone.position.y = 0.3; hg.add(cone);
      const tip = M(new THREE.SphereGeometry(0.12, 20, 16)); tip.position.y = 0.72; hg.add(tip);
      horns.push({ g: hg, s });
    }
    const limb = (len: number, r: number) => { const g = new THREE.Group(); const a = M(new THREE.CapsuleGeometry(r, len, 6, 16)); a.position.y = -len / 2 - r * 0.3; g.add(a); return g; };
    const armL = limb(0.5, 0.15); armL.position.set(-0.6, 1.42, 0); armL.rotation.z = -0.55; bodyG.add(armL);
    const armR = limb(0.5, 0.15); armR.position.set(0.6, 1.42, 0); armR.rotation.set(-0.35, 0, 0.45); bodyG.add(armR);
    for (const a of [armL, armR]) { const h = M(new THREE.SphereGeometry(0.19, 20, 16)); h.position.y = -0.78; a.add(h); }
    const apple = new THREE.Group(); apple.position.set(0.02, -1.02, 0.12); armR.add(apple);
    const ap = M(new THREE.SphereGeometry(0.24, 28, 20)); ap.scale.set(1.05, 0.92, 1); apple.add(ap);
    const bite = M(new THREE.SphereGeometry(0.1, 16, 12), voidM); bite.position.set(0.22, 0.06, 0.06); bite.scale.set(0.6, 1, 1); apple.add(bite);
    const stem = M(new THREE.CylinderGeometry(0.018, 0.025, 0.14, 8)); stem.position.y = 0.26; stem.rotation.z = 0.25; apple.add(stem);
    const leaf = M(new THREE.SphereGeometry(0.08, 12, 8)); leaf.position.set(0.08, 0.3, 0); leaf.scale.set(1.4, 0.4, 0.7); leaf.rotation.z = 0.5; apple.add(leaf);
    const legs: THREE.Group[] = [];
    for (const s of [-1, 1]) {
      const lg = limb(0.28, 0.17); lg.position.set(s * 0.3, 0.48, 0); bodyG.add(lg);
      const foot = M(new THREE.SphereGeometry(0.26, 24, 16)); foot.position.set(0, -0.52, 0.1); foot.scale.set(1.05, 0.58, 1.45); lg.add(foot);
      const sole = M(new THREE.TorusGeometry(0.25, 0.02, 6, 30), voidM); sole.position.set(0, -0.6, 0.1); sole.rotation.x = Math.PI / 2; sole.scale.set(1.05, 1.45, 1); lg.add(sole);
      legs.push(lg);
    }
    const tailG = new THREE.Group(); tailG.position.set(0, 0.75, -0.42); bodyG.add(tailG);
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.35, -0.35, -0.45), new THREE.Vector3(1.0, -0.2, -0.55),
      new THREE.Vector3(1.35, 0.45, -0.3), new THREE.Vector3(1.25, 1.15, -0.1), new THREE.Vector3(1.0, 1.45, 0),
    ]);
    tailG.add(M(new THREE.TubeGeometry(curve, 80, 0.055, 12)));
    const plug = new THREE.Group(); plug.position.copy(curve.getPoint(1));
    plug.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), curve.getTangent(1)); tailG.add(plug);
    const boot = M(new THREE.CapsuleGeometry(0.085, 0.22, 4, 12)); boot.position.y = 0.14; boot.scale.set(1.25, 1, 0.7); plug.add(boot);
    const pin = M(new THREE.BoxGeometry(0.13, 0.12, 0.05)); pin.position.y = 0.34; plug.add(pin);
    const pinHole = M(new THREE.BoxGeometry(0.09, 0.02, 0.052), voidM); pinHole.position.y = 0.4; plug.add(pinHole);

    const rt = new THREE.WebGLRenderTarget(2, 2, { samples: 4 });
    const post = new THREE.Scene(), oc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uni = {
      tScene: { value: rt.texture }, res: { value: new THREE.Vector2(1, 1) }, cell: { value: 7 }, time: { value: 0 },
      mouse: { value: new THREE.Vector2(-9999, -9999) }, glitch: { value: 0 },
    };
    const postMat = new THREE.ShaderMaterial({
      uniforms: uni, transparent: true, depthTest: false,
      vertexShader: `void main(){ gl_Position = vec4(position.xy, 0., 1.); }`,
      fragmentShader: `
        uniform sampler2D tScene; uniform vec2 res; uniform float cell; uniform float time; uniform vec2 mouse; uniform float glitch;
        float h(float n){ return fract(sin(n*91.345)*47453.21); }
        void main(){
          vec2 fc = gl_FragCoord.xy;
          float row = floor(fc.y / (cell*3.));
          float shift = glitch * step(.55, h(row + floor(time*24.))) * (h(row*1.7) - .5) * cell * 10.;
          vec2 c = (floor(fc / cell) + .5) * cell;
          vec4 s = texture2D(tScene, (c + vec2(shift, 0.)) / res);
          float lum = dot(s.rgb, vec3(.299, .587, .114));
          float on = step(.04, lum) * step(.5, s.a);
          float near = 1. - smoothstep(0., cell*22., length(c - mouse));
          float wave = .06 * sin(time * 2.2 - c.y * .012);
          float l = clamp(lum + wave + near*.25, 0., 1.);
          float r = cell * .5 * (.5 + .45 * l);
          float d = length(fc - c);
          float a = (1. - smoothstep(r - 1., r, d)) * on;
          vec3 col = mix(vec3(.42, .02, .015), vec3(1., .1, .06), smoothstep(.05, .7, l));
          col += vec3(.35, .2, .18) * smoothstep(.85, 1., l);
          col = mix(col, vec3(1.), glitch * step(.93, h(row + floor(time*30.))));
          float br = cell * (.09 + .22 * near);
          float ba = (1. - smoothstep(br - 1., br, d)) * (1. - on) * (.3 + .6 * near);
          vec3 bgc = mix(vec3(.17, .09, .08), vec3(.95, .12, .08), near);
          float oa = a + ba * (1. - a);
          vec3 outc = (col * a + bgc * ba * (1. - a)) / max(oa, .0001);
          gl_FragColor = vec4(outc, oa);
        }`,
    });
    post.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat));

    let W = 1, H = 1, visible = true;
    const size = () => {
      const r = box.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
      renderer.setSize(W, H, false);
      const bw = Math.round(W * DPR), bh = Math.round(H * DPR);
      rt.setSize(bw, bh); uni.res.value.set(bw, bh);
      const small = innerWidth < 760;
      uni.cell.value = (small ? 5.5 : 7.5) * DPR;
      const aspect = W / H; camera.aspect = aspect;
      const fillK = small ? 0.86 : 0.8;
      const tan = 2 * Math.tan(THREE.MathUtils.degToRad(15));
      const d = Math.max(4.3 / tan / fillK, 3.6 / (tan * aspect) / 0.92);
      camera.position.set(0, 1.9, d); camera.lookAt(0, 1.85, 0);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(size); ro.observe(box); size();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(box);

    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    const setMouse = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      uni.mouse.value.set((e.clientX - r.left) * DPR, (r.bottom - e.clientY) * DPR);
    };
    let spin = 0, spinV = 0, jumpT = -1, waveT = -1, glitchT = 0, nextGlitch = 4;
    let drag: { last: number; moved: number; t: number } | null = null;
    const onMove = (e: PointerEvent) => {
      ptr.tx = (e.clientX / innerWidth) * 2 - 1; ptr.ty = (e.clientY / innerHeight) * 2 - 1; setMouse(e);
      if (!drag) return;
      const dx = e.clientX - drag.last; drag.last = e.clientX; drag.moved += Math.abs(dx);
      spinV = dx * 0.012; spin += dx * 0.012;
    };
    const onDown = (e: PointerEvent) => { drag = { last: e.clientX, moved: 0, t: performance.now() }; canvas.classList.add("grab"); setMouse(e); };
    const onUp = () => {
      if (!drag) return; canvas.classList.remove("grab");
      if (drag.moved < 6 && performance.now() - drag.t < 400) { jumpT = 0; waveT = 0; glitchT = 0.45; }
      drag = null;
    };
    const onCancel = () => { drag = null; canvas.classList.remove("grab"); };
    addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerdown", onDown);
    addEventListener("pointerup", onUp);
    addEventListener("pointercancel", onCancel);

    const clock = new THREE.Clock();
    let blinkAt = 2, t = 0, raf = 0;
    const amp = reduce ? 0.3 : 1;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(clock.getDelta(), 0.05); t += dt;
      if (!visible) return;
      ptr.x += (ptr.tx - ptr.x) * 0.06; ptr.y += (ptr.ty - ptr.y) * 0.06;
      if (!drag) { spinV *= 0.94; spin += spinV; spin *= 0.985; }
      const scrollK = Math.min(1, scrollY / (innerHeight || 1));
      rig.rotation.y = spin + Math.sin(t * 0.45) * 0.18 * amp + ptr.x * 0.25 + scrollK * 1.2;
      rig.position.y = Math.sin(t * 1.8) * 0.05 * amp - scrollK * 0.4;
      if (jumpT >= 0) {
        jumpT += dt; const k = jumpT / 0.85;
        if (k >= 1) { jumpT = -1; bodyG.position.y = 0; bodyG.rotation.y = 0; }
        else { bodyG.position.y = Math.sin(k * Math.PI) * 1.1; bodyG.rotation.y = k * Math.PI * 2; }
      } else bodyG.scale.y = 1 + Math.sin(t * 1.8 + 1) * 0.012 * amp;
      headG.rotation.y += ((ptr.x * 0.55) - headG.rotation.y) * 0.1;
      headG.rotation.x += ((ptr.y * 0.22) - headG.rotation.x) * 0.1;
      headG.rotation.z = Math.sin(t * 0.9) * 0.04 * amp;
      for (const h of horns) h.g.rotation.z = -h.s * 0.5 + Math.sin(t * 3.1 + h.s) * 0.06 * amp - headG.rotation.y * 0.08;
      tailG.rotation.y = Math.sin(t * 1.3) * 0.22 * amp; tailG.rotation.x = Math.sin(t * 1.7) * 0.06 * amp;
      armR.rotation.x = -0.35 + Math.sin(t * 1.8) * 0.06 * amp;
      if (waveT >= 0) {
        waveT += dt; const k = waveT / 1.4;
        if (k >= 1) { waveT = -1; armL.rotation.z = -0.55; }
        else armL.rotation.z = -0.55 - Math.sin(Math.min(1, k * 3) * Math.PI / 2) * 2.1 * (1 - Math.max(0, k - 0.75) * 4) + Math.sin(k * 30) * 0.18;
      } else armL.rotation.z = -0.55 + Math.sin(t * 1.8) * 0.04 * amp;
      for (let i = 0; i < 2; i++) legs[i].rotation.x = jumpT >= 0 ? (i ? -0.35 : 0.35) * Math.sin((jumpT / 0.85) * Math.PI) : 0;
      blinkAt -= dt;
      const bk = blinkAt < 0 ? Math.max(0.08, Math.abs(blinkAt + 0.07) / 0.07) : 1;
      if (blinkAt < -0.14) blinkAt = 2.5 + Math.random() * 3;
      for (const e of eyes) e.scale.y = Math.min(1, bk);
      if (!reduce) { nextGlitch -= dt; if (nextGlitch < 0) { glitchT = Math.max(glitchT, 0.12); nextGlitch = 7 + Math.random() * 6; } }
      glitchT = Math.max(0, glitchT - dt);
      uni.glitch.value = Math.min(1, glitchT * 4);
      uni.time.value = t;
      renderer.setRenderTarget(rt); renderer.clear(); renderer.render(scene, camera);
      renderer.setRenderTarget(null); renderer.clear(); renderer.render(post, oc);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      removeEventListener("pointermove", onMove); canvas.removeEventListener("pointerdown", onDown);
      removeEventListener("pointerup", onUp); removeEventListener("pointercancel", onCancel);
      scene.traverse((o) => { if (o instanceof THREE.Mesh) o.geometry.dispose(); });
      skin.dispose(); voidM.dispose(); postMat.dispose(); rt.dispose(); renderer.dispose();
    };
  }, []);

  return (
    <div className="stage-box" ref={boxRef}>
      <canvas ref={canvasRef} className="stage" aria-label={label} />
      <svg className="fallback-mascot" viewBox="0 0 200 260" aria-hidden="true">
        <defs><pattern id="dp" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1.7" fill="#e8170f" /></pattern></defs>
        <g fill="url(#dp)"><circle cx="100" cy="78" r="52" /><path d="M62 40 48 6l26 26zM138 40l14-34-26 26z" /><circle cx="48" cy="6" r="7" /><circle cx="152" cy="6" r="7" /><rect x="66" y="122" width="68" height="80" rx="34" /><rect x="72" y="190" width="22" height="50" rx="11" /><rect x="106" y="190" width="22" height="50" rx="11" /></g>
      </svg>
    </div>
  );
}
