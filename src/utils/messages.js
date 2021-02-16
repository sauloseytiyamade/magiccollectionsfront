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
            return 'Opss!! Houve algum problema na autenticação, você será redirecionado para a página de login'
        case 'card exist collection':
            return 'Opss!! Este card já existe na sua coleção'
        case 'card collection created':
            return 'Card criado com sucesso!!'
        case 'card collection updated':
            return 'Card atualizado com sucesso'
        case 'edition created':
            return 'Edição criada com sucesso'
        case 'edition exist':
            return 'Opss!! Esta edição já existe'
        case 'card deleted':
            return 'Card excluído com sucesso'
        case 'card collection deleted':
            return 'Card excluído com sucesso'
        case 'card exist':
            return 'Opss!! Este card já existe'
        case 'card created':
            return 'Card criado com sucess'
        case 'card updated':
            return 'Card atualizado com sucesso'
        case 'user deleted':
            return 'Usuário deletado com sucesso'
        case 'user updated':
            return 'Usuário atualizado com sucesso'
        case 'file not supported':
            return 'Arquivo não suportado. Apenas imagens são suportadas'
        case 'No token provided':
            return 'Houve algum problema no sistema!!!'
        case 'color created':
            return 'Cor criada com sucesso'
        case 'color exist':
            return 'Cor já existe'
        case 'color updated':
            return 'Cor atualizada com sucesso'
        case 'color deleted':
            return 'Cor excluída com sucesso'
        case 'language created':
            return 'Linguagem criada com sucesso'
        case 'language exist':
            return 'Linguagem já existe'
        case 'language updated':
            return 'Linguagem atualizada com sucesso'
        case 'language deleted':
            return 'Linguagem excluída com sucesso'
        default:
            break;
    }
}

module.exports = {
    messages
}