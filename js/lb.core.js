/**
 * @author Hasin Hayder
 * LightBulb is a wrapper on top of Facebook JS-SDK for Graph API
 * LightBulb makes performing the most common tasks even easier.
 * @version: 1.00
 */
(function($) {
    var opts;
    var fbdata = {};
    $.fn.LightBulb = function(options) {
        var defaults = {
            apikey:"",
            secret:"",
            login:"true",
            permissions:"",
            cookie:true,
            xfbml:true,
            forcedPermission:false,
            callback:function(){}
        };
        opts = $.extend(defaults, options);
        //if (!$("#fb-root")) $("<div/>").attr("id", "fb-root").appendTo("body");
        FB.init({appId: opts.apikey, status: true, cookie: opts.cookie, xfbml: opts.xfbml});
        FB.Event.subscribe('auth.sessionChange', function(response) {
            if (response.session) {
                var session = FB.getSession();
                fbdata.accessToken = session.access_token;
                fbdata.facebookUserId = session.uid;
            }
        });

        FB.getLoginStatus(function(response) {
            if(opts.forcedPermission)
                $.fn.LightBulb.login();
            else if (response.session) {
                var session = FB.getSession();
                fbdata.accessToken = session.access_token;
                fbdata.facebookUserId = session.uid;
                if(jQuery.isFunction(opts.callback)) opts.callback.call(this, fbdata);
            }
            else {
                if (opts.login)
                    $.fn.LightBulb.login();
            }
        });

    }

    /**
     * @author Hasin Hayder
     * Perform a Facebook login and prompt the authentication dialog
     */
    $.fn.LightBulb.login = function() {
        alert("Calling Auth");
        FB.login(function(response) {
            if (response.session) {
                var session = FB.getSession();
                fbdata.accessToken = session.access_token;
                fbdata.facebookUserId = session.uid;
                if(jQuery.isFunction(opts.callback)) opts.callback.call(this, fbdata);
            }
        }, {perms:opts.permissions});
    }

    /**
     * @author Hasin Hayder
     * Log out the currently active user from Facebook
     */
    $.fn.LightBulb.logout = function() {
        FB.logout(function(response) {
            if (response) {
                fbdata.accessToken = 0;
                fbdata.facebookUserId = 0;
            }
        });
    }

    /**
     * @author Hasin Hayder
     * Return the parameters which was passed to this plugin while initializing
     */
    $.fn.LightBulb._getOptins = function() {
        return opts;
    }

    /**
     * @author Hasin Hayder
     * Return the currently authenticated and logged in users access token and Facebook user id
     */
    $.fn.LightBulb._getFacebookData = function() {
        return fbdata;
    }

    /**
     * @author Hasin Hayder
     * Return true if there is currently any active user logged in with this application
     */
    $.fn.LightBulb.isLoggedIn = function() {
        return fbdata.facebookUserId;
    }
})(jQuery);