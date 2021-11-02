export const bodyRequestLogin = (name, email) => {
    return {
        "usuariologin": name,
        "usuariosenha": email
    }
}