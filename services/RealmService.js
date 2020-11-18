const rp = require('request-promise');
const slug = require('slug');

class RealmService {

    constructor(oauthClient) {
        this.oauthClient = oauthClient;
    }

    async getRealms(namespace, locale, orderbyField, pageNumber) {
        const oauthToken = await this.oauthClient.getToken();
        const encodedCharacterName = encodeURIComponent(characterName);
		  const realmNameSlug = slug(realmName);
		  
		  const realmListDocumentURL = `https://us.api.blizzard.com/data/wow/search/realm?namespace=${namespace}&locale=${locale}&timezone=America%2FNew_York&orderby=${orderbyField}&_page=${pageNumber}&access_token=${oauthToken}`;

        const characterSummaryDocumentURL = `https://us.api.blizzard.com/profile/wow/character/${realmNameSlug}/${encodedCharacterName}`;
        const response = await rp.get({
            uri: realmListDocumentURL,
            json: true,
            qs: {
                locale: "en_US",
                namespace: "dynamic-classic-us"
            },
            headers: {
                Authorization: `Bearer ${oauthToken}`
            }
        });
        return response;
    }

    async getCharacterMedia(character) {
        const oauthToken = await this.oauthClient.getToken();
        const characterMediaDocumentURL = character.media.href;
        const response = await rp.get({
            uri: characterMediaDocumentURL,
            json: true,
            headers: {
                Authorization: `Bearer ${oauthToken}`
            }
        });
        return response;
    }

    async getUsersCharactersList(usersAccessToken) {
        const response = await rp.get({
            uri: `https://us.api.blizzard.com/profile/user/wow?namespace=profile-us`,
            json: true,
            headers: {
                Authorization: `Bearer ${usersAccessToken}`
            }
        });
        const { wow_accounts } = response;
        const characters = wow_accounts
            .map((account) => {
                return account.characters.map((character) => {
                    character.account_id = account.id;
                    return character;
                });
            })
            .flat()
            .sort((characterA, characterB) => {
                return (characterA.level < characterB.level) ? 1 : -1;
            });
        return characters;
    }
}

module.exports = RealmService;