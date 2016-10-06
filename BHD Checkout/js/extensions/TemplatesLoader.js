// TemplatesLoader.js
//
// This loads the custom templates and macros into the application
// ----------------

(function(SC){
    SC.bliss_templates.macros = _.union(SC.templates.macros, SC.bliss_templates.macros);
    SC.templates = _.extend(SC.templates, SC.bliss_templates);
})(SC);
