const handlerError = (error) => {
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

        default:
            break;
    }
}

module.exports = {
    handlerError
}