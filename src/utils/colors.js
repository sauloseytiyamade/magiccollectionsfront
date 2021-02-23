const colors = (colors) => {
    switch (colors) {
        case 'Preto':
        case 'Pretos':
        case 'Preta':
        case 'Pretas':
        case 'Black':
            return '#000000'
        case 'Branco':
        case 'Brancos':
        case 'Branca':
        case 'Brancas':
        case 'White':
        case 'Yellow':
        case 'Amarelo':
        case 'Amarelos':
        case 'Amerala':
        case 'Ameralas':
            return '#FFC107'
        case 'Vermelho':
        case 'Vermelhos':
        case 'Vermelha':
        case 'Vermelhas':
        case 'Red':
            return '#DC3545'
        case 'Azul':
        case 'Azuis':
        case 'Blue':
            return '#007BFF'
        case 'Verde':
        case 'Verdes':
        case 'Green':
            return '#28A745'
        case 'Multicolor':
        case 'Multicolorido':
        case 'Multicoloridos':
            return '#A69B00'
        case 'Incolor':
        case 'Incolores':
        case 'Gray':
            return '#6C757D'
        case 'Purple':
        case 'Roxo':
        case 'Roxos':
            return '#800080'
        case 'Maroon':
        case 'Marrom':
        case 'Marrons':
            return '#800000'
        case 'Pink':
        case 'Rosa':
        case 'Rosas':
            return '#FFC0CB'
        case 'Orange':
        case 'Laranja':
        case 'Laranjas':
            return '#FFA500'
        default:
            return '#191970'
            break;
    }
}

module.exports = {
    colors
}