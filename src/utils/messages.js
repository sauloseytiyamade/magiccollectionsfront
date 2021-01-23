const messages = (error) => {
    switch (error) {
        case 'user or password invalid':
            return 'Usuário ou senha inválidos'
        case 'invalid email':
            return 'Seu e-mail está inválido'
        case 'user exist':
            return 'Este usuário já está cadastrado'
        case 'user not found':
            return 'Este usuário não está cadastrado'
        case 'Token invalid':
            return 'Opss!! Houve algum problema de autenticação'
        case 'card exist collection':
            return 'Opss!! Este card já existe na sua coleção'
        case 'card collection created':
            return 'Card Criado com Sucesso!!'
        case 'card collection updated':
            return 'Card Atualizado com Sucesso'
        default:
            break;
    }
}

module.exports = {
    messages
}