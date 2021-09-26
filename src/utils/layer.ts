import { render, unmountComponentAtNode } from 'react-dom'
import React from 'react'

interface LayerOptions {
    styles?: React.CSSProperties
    maskOpacity?: number
}

export class Layer {
    private layerContainer: HTMLDivElement
    public layerPromise?: Promise<any>
    private doPop?: (params: any) => void
    private options: LayerOptions = {
        styles: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            touchAction: 'none',
        },
        maskOpacity: 0.5,
    }

    constructor(component: any, options?: LayerOptions) {
        this.options = Object.assign({}, this.options, options)

        const layerContainer = document.createElement('div')

        for (let key in this.options.styles) {
            // tslint:disable
            ;(layerContainer.style as any)[key] = (this.options.styles as any)[key]
        }

        render(component, layerContainer)

        this.layerContainer = layerContainer
    }

    public show() {
        document.body.appendChild(this.layerContainer)

        this.layerPromise = new Promise((resolve, reject) => {
            this.doPop = resolve
        }).then(data => {
            this.destory()

            return data
        })

        return this.layerPromise as Promise<any>
    }

    public pop(params: any) {
        this.doPop && this.doPop(params)
    }

    public popSelf(params?: any) {
        layerManage.popLayer(this, params)
    }

    public destory() {
        if (document.body.contains(this.layerContainer)) {
            unmountComponentAtNode(this.layerContainer)
            document.body.removeChild(this.layerContainer)
        }
    }
}

class LayerManage {
    private globalLayerStack: Layer[] = []

    public get isShow() {
        return this.globalLayerStack.length > 0
    }

    public showLayer<T>(layer: Layer): Promise<T> {
        this.globalLayerStack.push(layer)

        return layer.show()
    }

    public pop(params?: any) {
        const layer = this.globalLayerStack.pop()
        layer && layer.pop(params)
    }

    public popLayer(layerInstance: Layer, params?: any) {
        const layer = this.globalLayerStack.splice(
            this.globalLayerStack.findIndex(l => l === layerInstance),
            1,
        )[0]
        if (layer) {
            layer.pop(params)
        }
    }

    public popAll(params?: any) {
        while (this.globalLayerStack.length > 0) {
            this.pop(params)
        }
    }
}

export const layerManage = new LayerManage()

export const showLayer = (component: any, options?: LayerOptions) => {
    return layerManage.showLayer(new Layer(component, options))
}
