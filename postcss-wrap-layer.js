import postcss from 'postcss'

const plugin = () => ({
  postcssPlugin: 'postcss-wrap-layer',
  Once(root, { result }) {
    const filePath = result.opts.from || ''
    if (!filePath.includes('globals.css')) return

    const nodes = [...root.nodes]
    root.removeAll()

    const layerRule = postcss.atRule({ name: 'layer', params: 'tailwind' })
    for (const node of nodes) {
      layerRule.append(node.clone())
    }
    root.append(layerRule)
  },
})

plugin.postcss = true

export default plugin
