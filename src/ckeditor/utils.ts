import Element from '@ckeditor/ckeditor5-engine/src/model/element'

export function getChildNodeByAttribute(node: Element, attributeName: string, attributeValue: string) : Element | null{
    for (let i = 0; i < node.childCount; i++) {
        const child = node.getChild(i)
        if (child instanceof Element && child.getAttribute(attributeName) === attributeValue) {
            return child
        }

        const result = getChildNodeByAttribute(child as Element, attributeName, attributeValue)
        if (result) {
            return result
        }
    }
    
    return null
}