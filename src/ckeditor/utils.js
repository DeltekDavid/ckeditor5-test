export function getItemByAttributeValue(range, attribute, value) {
    if (!range) {
        return null
    }

    for (const treeNode of range.getWalker()) {
        if (treeNode.item.getAttribute(attribute) === value) {
            return treeNode.item
        }
    }

    return null
}

export function getItemByAttribute(range, attribute) {
    if (!range) {
        return null
    }

    for (const treeNode of range.getWalker()) {
        if (treeNode.item.getAttribute(attribute)) {
            return treeNode.item
        }
    }

    return null
}

export function getItemByName(range, name) {
    if (!range) {
        return null
    }

    for (const treeNode of range.getWalker()) {
        if (treeNode.item.name === name) {
            return treeNode.item
        }
    }

    return null
}

export function getChildByAttributeValue(element, attribute, value) {
    for (const child of element.getChildren()) {
        if (child.getAttribute(attribute) === value) {
            return child
        }
    }

    return null
}

/** Runs conversion for all of our custom model elements. Call this when the UI needs to update
 * in response to a model change, config change, or anything that doesn't automatically
 * update the UI.
 */
export function reRunConverters(editor) {
    const root = editor.model.document.getRoot();
    const range = editor.model.createRangeIn(root);

    for (const value of range.getWalker({ ignoreElementEnd: true })) {
        if (value.item.is('element') && (value.item.name === 'bracketOption'
            || value.item.name === 'unitsOfMeasure')) {
            editor.editing.reconvertItem(value.item);
        }
    }
}