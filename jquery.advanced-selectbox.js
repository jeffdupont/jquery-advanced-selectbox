/*!
 * jQuery Advanced Selectbox Plugin v0.1
 *
 * Author: Jeff Dupont
 * ==========================================================
 * Copyright 2012 iAcquire, LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ==========================================================
 */

;(function( $ ){

 /* PUBLIC CLASS
  * ============ */
  var AdvancedSelectbox = function ( element, options ) {
    this.$element = $(element);
    this.options = options;
    this.enabled = true;

    this.width = this.$element.outerWidth();
    this.height = this.$element.outerHeight();
  };

  AdvancedSelectbox.prototype = {

    valuebox: function() {
      if (!this.$valuebox) {
        this.$valuebox = $('<div class="advanced-selectbox-values"></div>')
          .css({ display: 'block', cursor: 'pointer' })
          .attr('tabindex', '0')
          .bind('focus', function() {
            $(this).parent().trigger('mouseenter');
          })

        this.$element.before(this.$valuebox);
      }
      return this.$valuebox;
    }

  , show: function() {
      var $valuebox

      $valuebox = this.valuebox();
      $valuebox
        .animate({ opacity:0 })
        .removeAttr('tabindex')

      this.$element
        .stop(true, true)
        .css({
            position: 'absolute'
          , zIndex: 2
          , width: this.width
          , height: this.height
          , boxShadow: "1px 1px 2px rgba(0,0,0,0.3)"
          , top: this.$valuebox.position().top
        })
        .slideDown()
        .focus()
    }

  , hide: function() {
      var $valuebox

      this.getSelectedValues();

      $valuebox = this.valuebox();
      $valuebox
        .animate({ opacity:1 })
        .attr('tabindex', '0')

      this.$element
        .stop(true, true)
        .hide();
    }

  , getSelectedValues: function() {
      var $e = this.$element
        , o = this.options
        , $valuebox
        , current_count

      $valuebox = this.valuebox();
      $valuebox.empty();

      var selected = $e.find("option"+(o.filter?"[data-advanced-selectbox!='nocount']":"")+":selected")
      var current_count = selected.length
      if(current_count == 0) {
        $valuebox.append(
          $("<div></div>")
            .html("None")
        );
      }

      selected.each(function(idx) {
        if (idx > o.show-1) return false;

        var selected_text = $(this).text().replace(/^\s*|\s*$/, "");
        if (selected_text == "" && current_count == 1) {
          selected_text = "None";
        }
        if (idx == o.show-1 && current_count > o.show)
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

    if (options.exclude.length > 0) {
      this.find("option").each(function() {
        var $opt = $(this)
        if ($.inArray($opt.text(), options.exclude) > -1) {
          $opt.attr("data-advanced-selectbox", "nocount");
        }
      })
    }

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
      var advancedselectbox = get((this.nodeName == "SELECT") ? this : $(this).children("select")[0]);
      advancedselectbox.state = "in";

      setTimeout(function() {
        if (advancedselectbox.state == 'in') {
          advancedselectbox.show()
        }
      }, options.delayIn);
    }

    function leave() {
      var advancedselectbox = get((this.nodeName == "SELECT") ? this : $(this).children("select")[0]);
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
    this.parent()[binder]('mouseenter', enter)[binder]('mouseleave', leave);
    this.bind('blur', function() {
      $(this).parent().trigger('mouseleave');
    });

    return this;
  };

  $.fn.advancedselectbox.AdvancedSelectbox = AdvancedSelectbox;

  $.fn.advancedselectbox.elementOptions = function(el, options) {
    return $.metadata ? $.extend({}, options, $(el).metadata()) : options
  };

  $.fn.advancedselectbox.defaults = {
    animate: true
  , delayIn: 300
  , delayOut: 300
  , live: false
  , show: 4
  , filter: true
  , exclude: []
  };


})(window.jQuery);