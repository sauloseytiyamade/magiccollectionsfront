const colors = (colors) => {
    switch (colors) {
        case 'Preto':
        case 'Preta':
        case 'Black':
            return '#000000'
        case 'Branco':
        case 'Branca':
        case 'White':
            return '#FFC107'
        case 'Vermelho':
        case 'Vermelha':
        case 'Red':
            return '#DC3545'
        case 'Azul':
        case 'Blue':
            return '#007BFF'
        case 'Verde':
        case 'Green':
            return '#28A745'
        case 'Multicolor':
        case 'Multicolorido':
            return '#A69B00'
        case 'Incolor':
        case 'Gray':
            return '#6C757D'
        default:
            break;
    }
}

module.exports = {
    colors
}