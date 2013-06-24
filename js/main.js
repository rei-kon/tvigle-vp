var Slider,
    Popup,
    Menu;

Slider = (function(){
    var Core = function (element, options) {

        if (!element) {
            throw "Element is not defined!";
        }

        this.options = {
            "animation_speed": 300,
            "easing": 'linear',
            "count":1
        };

        this.element = element;
        this.slider = this.element.find('ul') ;
    };

    Core.prototype.slide = function(button) {
        if(button.hasClass('slide-to-right')) {
            this.slideRight();
        }
        else {
            this.slideLeft();
        }
    };

    Core.prototype.slideLeft = function() {
        var step = this.element.width(),
            current_step = parseInt(this.slider.css('margin-left')),
            self = this,
            count = this.element.find('li').size();
        if(this.options.count == 1){
            return;
        }
        else {
            this.slider.animate({
                marginLeft: current_step + step
            }, this.options.animation_speed, function(){
                self.options.count--;
                self.checkSlider();
            });
        }
    };

    Core.prototype.slideRight = function() {

        var step = this.element.width(),
            current_step = parseInt(this.slider.css('margin-left')),
            self = this,
            count = this.element.find('li').size();

        if(this.options.count == count){
            return;
        }
        else {
            this.slider.animate({
                marginLeft: current_step - step
            }, this.options.animation_speed, function(){
                self.options.count++;
                self.checkSlider();
            });
        }

    };

    Core.prototype.checkSlider = function() {
        var count = this.element.find('li').size(),
            left_button = this.element.find('.slide-to-left'),
            right_button = this.element.find('.slide-to-right');

        console.log(this.options.count, count)
        if(this.options.count == count){
            right_button.animate({
                right:-33
            }, this.options.animation_speed);
        }
        else if (this.options.count == 1){
            left_button.animate({
                left:-33
            }, this.options.animation_speed);
        }
        else if(this.options.count > 1 && this.options.count < count){
            left_button.animate({
                left:0
            }, this.options.animation_speed);
            right_button.animate({
                right:0
            }, this.options.animation_speed);
        }
    };

    Core.prototype.check = function() {
        var count = this.element.find('li').size();

        this.slider.width((this.element.width() + 3) *count);
        this.element.find('li').width(this.element.width());
        if(count > 0) {
            this.element.find('.slide-to-right').animate({
                right: 0
            }, this.options.animation_speed);
        }
    };

    Core.prototype.onresize = function(){
        this.element.find('li').width(this.element.width());
        this.slider.css('margin-left', -this.element.width()*(this.options.count - 1));
    };

    return Core;

})(Slider || (Slider = {}));

Menu = (function(){
    var Core = function (element, options) {

        if (!element) {
            throw "Element is not defined!";
        }

        this.options = {
            "animation_speed": 200,
            "easing": 'linear'
        };

        this.element = element;
        this.button = this.element.find('.menu-button');
    };

    Core.prototype.hover = function(event, element) {
        var el_width = element.width() + 100,
            el_offset = element.parent('li').position().left;

        this.moveTo(el_width, el_offset, element);
    };

    Core.prototype.moveTo = function(width, offset, element){
        var self = this;
        this.element.find('a').removeClass('hovered')
        this.button.animate({
            left:offset + element.position().left - 50,
            width:width
        }, this.options.animation_speed, function(){
            self.button.fadeIn(self.options.animation_speed);
            element.addClass('hovered');
        })
    };

    Core.prototype.onresize = function(){
    };

    return Core;

})(Menu || (Menu = {}));

Popup = (function(){
    var Core = function (element, options) {

        if (!element) {
            throw "Element is not defined!";
        }

        this.options = {
            "animation_speed": 200,
            "easing": 'linear'
        };

        this.element = element;
        this.layout = 'login';
    };

    Core.prototype.close = function() {
        this.element.fadeOut(this.options.animation_speed);
    };

    Core.prototype.open = function() {
        this.element.fadeIn(this.options.animation_speed);
    };

    Core.prototype.toggleLayout = function() {
        var self = this;
        this.element.find('#' + this.layout).fadeOut(this.options.animation_speed);

        if(this.layout == 'login'){
            this.layout = 'registration';

        } else {
            this.layout = 'login';
        }

        setTimeout(function(){
            self.element.find('#' + self.layout).fadeIn(self.options.animation_speed);
        },self.options.animation_speed/2);
    };


    return Core;

})(Popup || (Popup = {}));

$(document).ready(function(){
    var slider = $('.slider'),
        NewSlider = new Slider(slider);
        NewSlider.check();
        slider.delegate('.slide-to', 'click', function(){
            NewSlider.slide($(this));
        });

    var menu = $('.menu'),
        NewMenu = new Menu(menu);
        menu.delegate('a', 'mouseover', function(event){
            NewMenu.hover(event, $(this));
        });

    $(window).on({
        resize: function(){
            NewSlider.onresize();
        }
    });

    $('.footer').delegate('.ask', 'click', function(){
        var footer = $(this).parents('.footer'),
            wrapper = $('.wrapper'),
            push = $('.push'),
            // top,
            opacity,
            height;

        if($(this).hasClass('opened-footer')){
            // top = 0;
            opacity = 0.1;
            height = 81;
        }
        else {
            // top = 57;
            opacity = 1;
            height = 138;
        }
        $(this).toggleClass('opened-footer');
        footer.animate({
            height: height//,
            // top: -top
        },300)
        push.animate({
            height: height//,
            // top: -top
        },300)
        wrapper.animate({
            marginBottom: -height//,
            // top: -top
        },300)
        footer.find('.col').animate({
            opacity:opacity
        },300)

    });

    var popup = $('.popup'),
        NewPopup = new Popup(popup);

    popup.delegate('.log-reg-btn', 'click', function(){
        NewPopup.toggleLayout();
    });
    popup.delegate('.close', 'click', function(){
        NewPopup.close();
    });
    $('body').delegate('.log-reg-button', 'click', function(){
        NewPopup.open();
    });
});
