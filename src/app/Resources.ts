import * as THREE from 'three';
import { EventEmitter } from 'events';

import { Loader } from './Loader';

enum ResourceType {
    Texture,
    Model
}

export interface IResource {
    name: string;
    source: string;
    type: ResourceType;
}

export class Resources extends EventEmitter {
    private items: Map<string, any>;
    private loader: Loader;

    constructor (renderer: THREE.WebGLRenderer) {
        super();

        this.items = new Map<string, any>();

        this.loader = new Loader(renderer);
        this.loader.load([
            { name: 'character', source: '/models/jammo-compressed.glb', type: ResourceType.Model },

            { name: 'floor', source: '/textures/prototype_512x512_blue2.png', type: ResourceType.Texture },
            { name: 'character-map', source: '/textures/jammo_albedo_alpha.png', type: ResourceType.Texture },
            { name: 'character-ao', source: '/textures/jammo_ambientocclusion.png', type: ResourceType.Texture },
            { name: 'character-normal', source: '/textures/jammo_normal.png', type: ResourceType.Texture }
        ]);

        this.loader.on('fileEnd', (resource, data) => {
            switch (resource.type) {
            case ResourceType.Texture:
                const texture = new THREE.Texture(data);
                texture.needsUpdate = true;
                this.items.set(resource.name, texture);
                break;

            default:
                this.items.set(resource.name, data);
                break;
            }

            this.emit('progress', this.loader.loaded / this.loader.toLoad);
        });

        this.loader.on('end', () => {
            this.emit('ready');
        });
    }

    public get (name: string): any {
        if (this.items.has(name)) {
            return this.items.get(name);
        }
        console.warn('Can\'t find item ' + name);
        return null;
    }
}
