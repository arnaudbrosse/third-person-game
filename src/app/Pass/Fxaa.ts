import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';

import { Pass } from './Pass';

export class Fxaa extends Pass {
    private renderer: THREE.WebGLRenderer;
    private fxaaPass: ShaderPass;

    constructor (composer: EffectComposer, renderer: THREE.WebGLRenderer) {
        super();

        this.renderer = renderer;

        this.fxaaPass = new ShaderPass(FXAAShader);
        this.fxaaPass.material.uniforms.resolution.value.x = 1 / (window.innerWidth * this.renderer.getPixelRatio());
        this.fxaaPass.material.uniforms.resolution.value.y = 1 / (window.innerHeight * this.renderer.getPixelRatio());
        this.fxaaPass.enabled = false;

        composer.addPass(this.fxaaPass);
    }

    public tick (_dt: number): void {}

    public resize (): void {
        this.fxaaPass.material.uniforms.resolution.value.x = 1 / (window.innerWidth * this.renderer.getPixelRatio());
        this.fxaaPass.material.uniforms.resolution.value.y = 1 / (window.innerHeight * this.renderer.getPixelRatio());
    }
}
