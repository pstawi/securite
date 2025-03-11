export const decodeToken = (token) => {
    try{
        // récupération 2e partie du token (payload)
        const base64Url = token.split('.')[1];
        // console.log('base64Url', base64Url);

        // remplacement des caractères spéciaux
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // console.log('base64', base64);

        const decode = decodeURIComponent(
            atob(base64) // décodage base64
            .split('') // transformation en tableau
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)) // conversion en hexa
            .join('') // concaténation
        );

        // console.log('decode', decode);
        return JSON.parse(decode);
    } catch (e) {
        console.log(e);
        return null;
    }
};