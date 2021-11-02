export const bodyRequestCreateProduct = (productName, productValue, productColor, componentName, componentQuantity) => {
    return {
        "produtonome": productName,
        "produtovalor": productValue,
        "produtocores": [
            productColor
        ],
        "componentes": [
            {
                "componentenome": componentName,
                "componentequantidade": componentQuantity
            }
        ]
    }
}