(function () {
    var typeAliases = {
        note: 'note',
        info: 'info',
        tip: 'info',
        warning: 'warning',
        error: 'error',
        citation: 'citation'
    };

    var defaultTitles = {
        note: 'Note',
        info: 'Info',
        warning: 'Warning',
        error: 'Error',
        citation: ''
    };

    function firstTextNode(element) {
        var walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        return walker.nextNode();
    }

    function parseFirstLine(text) {
        var alertMatch = text.match(/^\s*\[!(note|info|tip|warning|error|citation)\](?:[ \t]+([^\r\n]*?))?[ \t]*(?:\r?\n|$)/i);
        if (alertMatch) {
            return {
                type: typeAliases[alertMatch[1].toLowerCase()],
                title: (alertMatch[2] || '').trim(),
                length: alertMatch[0].length
            };
        }

        var normalizedText = text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
        var premonitionMatch = normalizedText.match(/^\s*(note|info|tip|warning|error|citation)[ \t]+(["'])(.*?)\2[ \t]*(?:\r?\n|$)/i);
        if (premonitionMatch) {
            return {
                type: typeAliases[premonitionMatch[1].toLowerCase()],
                title: premonitionMatch[3].trim(),
                length: premonitionMatch[0].length
            };
        }

        return null;
    }

    function removePrefix(textNode, length) {
        textNode.nodeValue = textNode.nodeValue.slice(length);
    }

    function createIcon(type) {
        var svgNamespace = 'http://www.w3.org/2000/svg';
        var xlinkNamespace = 'http://www.w3.org/1999/xlink';
        var svg = document.createElementNS(svgNamespace, 'svg');
        var use = document.createElementNS(svgNamespace, 'use');
        var iconName = '#icon-' + type;

        svg.setAttribute('class', 'icon');
        svg.setAttribute('aria-hidden', 'true');
        use.setAttributeNS(xlinkNamespace, 'xlink:href', iconName);
        use.setAttribute('href', iconName);
        svg.appendChild(use);
        return svg;
    }

    function createPremonition(blockquote, parsed) {
        var first = blockquote.firstElementChild;
        var firstText = firstTextNode(first);
        var box = document.createElement('div');
        var header = document.createElement('div');
        var title = document.createElement('div');
        var content = document.createElement('div');

        removePrefix(firstText, parsed.length);

        box.className = 'premonition ' + parsed.type;
        header.className = 'header';
        title.className = 'title';
        content.className = 'content';
        header.appendChild(createIcon(parsed.type));

        if (parsed.type === 'citation') {
            var reference = document.createElement('div');
            reference.className = 'ref';
            if (parsed.title) {
                reference.textContent = '------ ' + parsed.title;
            }
            while (blockquote.firstChild) {
                content.appendChild(blockquote.firstChild);
            }
            box.appendChild(header);
            box.appendChild(content);
            if (parsed.title) {
                box.appendChild(reference);
            }
        } else {
            title.textContent = parsed.title || defaultTitles[parsed.type];
            header.appendChild(title);
            while (blockquote.firstChild) {
                content.appendChild(blockquote.firstChild);
            }
            box.appendChild(header);
            box.appendChild(content);
        }

        blockquote.parentNode.replaceChild(box, blockquote);
    }

    function transformAlerts() {
        var blockquotes = document.querySelectorAll('.markdown-body blockquote');

        Array.prototype.forEach.call(blockquotes, function (blockquote) {
            var first = blockquote.firstElementChild;
            if (!first || first.tagName.toLowerCase() !== 'p') {
                return;
            }

            var firstText = firstTextNode(first);
            if (!firstText) {
                return;
            }

            var parsed = parseFirstLine(firstText.nodeValue);
            if (parsed) {
                createPremonition(blockquote, parsed);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', transformAlerts);
    } else {
        transformAlerts();
    }
}());
