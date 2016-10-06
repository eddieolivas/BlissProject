(function (application) {

    'use strict';

    application.on('beforeStartApp', function() {

        var configuration = application.Configuration;

        application.addModule('Cart.Extend');

        _.extend(configuration, {

        });

    });

}(SC.Application('Checkout')));