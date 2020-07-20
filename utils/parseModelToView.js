function parseModelToView(template, attributes) {
    var i;
    for (i in attributes) {
        if (attributes.hasOwnProperty(i)) {
            template = template.replace('{{' + i + '}}', attributes[i]);
        }
    }

    return template;
}