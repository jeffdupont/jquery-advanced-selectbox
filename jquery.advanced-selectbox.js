/*!
 * jQuery Advanced Selectbox Plugin v0.1
 *
 * Copyright 2012, Jeff Dupont / iAcquire.com
 */

;(function($){

 /* PUBLIC CLASS
  * ============ */
  var AdvancedSelectbox = function ( element, options ) {
    this.$element = $(element);
    this.options = options;
    this.enabled = true;
  };

  AdvancedSelectbox.prototype = {

    valuebox: function() {
      if (!this.$valuebox) {
        this.$valuebox = $('<div class="advanced-selectbox-values"></div>')
          .css({ display: 'block' })
          .html("i am the value box");

        this.$element.before(this.$valuebox);
      }
      return this.$valuebox;
    }

  , show: function() {
      var $valuebox

      $valuebox = this.valuebox();
      $valuebox.hide();

      this.$element.show();
    }

  , hide: function() {
      var $valuebox

      this.getSelectedValues();

      $valuebox = this.valuebox();
      $valuebox.show();

      this.$element.hide();
    }

  , getSelectedValues: function() {
      var $e = this.$element
        , o = this.options
        , $valuebox
        , current_count

      $valuebox = this.valuebox();
      $valuebox.empty();
      
      current_count = $e.find("option:selected").length
      if(current_count == 0) {
        $valuebox.append(
          $("<div></div>")
            .html("None")
        );
      }

      $e.find("option:selected").each(function(idx) {
        if (idx > o.show) return false;

        var selected_text = $(this).text().replace(/^\s*|\s*$/, "");
        if (selected_text == "" && current_count == 1) {
          selected_text = "None";
        }
        if (idx == o.show && current_count > o.show + 1)
          selected_text = "Plus <b>" + (current_count-o.show) + "</b> additional item" + (current_count > 1 ? "s" : "")

        var new_value = $("<div></div>")
            .html(selected_text)

        $valuebox.append(new_value)
      })
   }

  , enable: function() {
      this.enabled = true;
    }

  , disable: function() {
      this.enabled = false;
    }

  , toggleEnabled: function() {
      this.enabled = !this.enabled;
    }

  };

  $.fn.advancedselectbox = function (options) {
    $.fn.advancedselectbox.init.call(this, options, AdvancedSelectbox, 'advancedselectbox');
    return this;
  };

  $.fn.advancedselectbox.init = function (options, Constructor, name) {
    var advancedselectbox
      , binder
      , eventIn
      , eventOut;

    if (options === true) {
      return this.data(name);
    } else if (typeof options == 'string') {
      advancedselectbox = this.data(name);
      if (advancedselectbox) {
        advancedselectbox[options]();
      }
      return this;
    }

    options = $.extend({}, $.fn[name].defaults, options);

    function get(el) {
      var advancedselectbox = $.data(el, name);

      if (!advancedselectbox) {
        advancedselectbox = new Constructor(el, $.fn.advancedselectbox.elementOptions(el, options));
        $.data(el, name, advancedselectbox);

        advancedselectbox.hide();
      }

      return advancedselectbox;
    };

    function enter() {
      var advancedselectbox = get($(this).children("select")[0]);
      advancedselectbox.state = "in";

      setTimeout(function() {
        if (advancedselectbox.state == 'in') {
          advancedselectbox.show()
        }
      }, options.delayIn);
    }

    function leave() {
      var advancedselectbox = get($(this).children("select")[0]);
      advancedselectbox.state = "out";

      setTimeout(function() {
        if (advancedselectbox.state == 'out') {
          advancedselectbox.hide()
        }
      }, options.delayOut);
    }

    if (!options.live) {
      this.each(function() {
        get(this);
      });
    }

    binder = options.live ? 'live' : 'bind';

    if ($.fn.hoverIntent) {
      this.parent()[binder]('mouseenter', function(){
        if (!this.parent().data('initHoverIntent')) {
          this.parent().data('initHoverIntent', true);
          this.parent().hoverIntent({
            over: enter
          , timeout: options.delay
          , out: leave
          });
          this.parent().trigger('mouseenter');
        }
      });
    } else {
      this.parent()[binder]('mouseenter', enter)[binder]('mouseleave', leave);
    }

    return this;
  };

  $.fn.advancedselectbox.AdvancedSelectbox = AdvancedSelectbox;

  $.fn.advancedselectbox.elementOptions = function(ele, options) {
    return $.metadata ? $.extend({}, options, $(ele).metadata()) : options
  };

  $.fn.advancedselectbox.defaults = {
    animate: true
  , delayIn: 100
  , delayOut: 100
  , live: false
  , show: 3
  };


})(jQuery);