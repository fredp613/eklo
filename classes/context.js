

export default class Context {
 
	constructor() {

	}

	getContext(keyword, callback) {
		const keywordSan = keyword.toLowerCase()
		
		if (keywordSan.indexOf("weather") > -1 && keywordSan.indexOf("forecast") == -1) {
			return callback("weather")
		}

		if (keywordSan.indexOf("forecast") > -1 && keywordSan.indexOf("weather") > -1) {
			return callback("forecast")
		}


		if (!(keywordSan.indexOf("weather") > -1 || keywordSan.indexOf("forecast") > -1)) {
			if (keywordSan.indexOf("news") > -1) {
				return callback("news")
			}

			if (keywordSan.indexOf("facebook") > -1) {
				return callback("facebook")
			}

			if (keywordSan.indexOf("twitter") > -1) {
				return callback("twitter")
			}
		}
		
		return callback("unknown");
	}

}
