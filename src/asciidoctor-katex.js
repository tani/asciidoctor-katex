(function (Opal) {
  var mainModule = Opal.const_get_qualified(Opal.Asciidoctor, 'Katex');
  var KatexAdapterClass = Opal.const_get_qualified(mainModule, 'KatexAdapter');
  var TreeprocessorClass = Opal.const_get_qualified(mainModule, 'Treeprocessor');

  /**
   * Creates and configures a new instance of Asciidoctor::Katex::Treeprocessor.
   *
   * @param {Object} opts
   * @param {Object} opts.katex The katex object to use for rendering.
   *   Defaults to `require('katex')`.
   * @param {boolean} opts.requireStemAttr `true` to not process math expressions
   *   when `stem` attribute is not declared, `false` to process anyway.
   *   Defaults to `true`.
   * @param {Object} opts.katexOptions The default options for `katex.render()`.
   *   Defaults to empty object.
   * @return {TreeProcessor}
   */
  function TreeProcessor (opts) {
    opts = opts || {};

    var katex = opts.katex || require('katex');
    var adapter = KatexAdapterClass.$new(Opal.hash(opts.katexOptions || {}), katex);

    return TreeprocessorClass.$new(Opal.hash({
      require_stem_attr: opts.requireStemAttr || true,
      katex_renderer: adapter,
    }));
  }

  /**
   * Creates and configures the Katex extension and registers it into the given
   * extensions registry.
   *
   * @param {Object} registry The Asciidoctor extensions registry to register this
   *   extension into. It should be `Asciidoctor().Extensions` or
   *   `Asciidoctor.Extensions.create()`.
   * @param {Object} opts See {TreeProcessor}.
   * @return The given *registry*.
   */
  function register (registry, opts) {
    var processor = TreeProcessor(opts);

    if (typeof registry.register === 'function') {
      registry.register(function () {
        this.treeProcessor(processor);
      })
    } else if (typeof registry.block === 'function') {
      registry.treeProcessor(processor);
    } else {
      throw new TypeError('Invalid registry object');
    }
    return registry;
  }

  var facade = {
    version: mainModule.$$const.VERSION.toString(),
    TreeProcessor: TreeProcessor,
    register: register,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = facade;
  }
  return facade;
})(Opal);
