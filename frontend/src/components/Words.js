const axios = require('axios').default;
const WORD_LIST_API = "https://9lle070ysl.execute-api.ap-northeast-1.amazonaws.com";
const GETWORD = "/api/words";

async function randomWord() {
  try {
		const res = await axios.get(WORD_LIST_API+GETWORD);
		return res.data.word;
	} catch (err) {
		console.error(err);
	}
}

export { randomWord }