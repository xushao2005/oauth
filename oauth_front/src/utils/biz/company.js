export const filter = (input, option) => {
	let companyLikes
	if (input.startsWith("ch")) {
		companyLikes = ["重庆", "成都", "长沙"]
	} else if (input.startsWith("be")) {
		companyLikes = ["北京"]
	} else if (input.startsWith("sh")) {
		companyLikes = ["深圳", "上海"]
	} else if (input.startsWith("gu")) {
		companyLikes = ["广州"]
	} else if (input.startsWith("yi")) {
		companyLikes = ["义乌"]
	} else if (input.startsWith("ha")) {
		companyLikes = ["杭州"]
	} else if (input.startsWith("ni")) {
		companyLikes = ["宁波"]
	} else if (input.startsWith("xi")) {
		companyLikes = ["香港", "厦门"]
	} else if (input.startsWith("we")) {
		companyLikes = ["温州"]
	} else if (input.startsWith("do")) {
		companyLikes = ["东莞"]
	} else if (input.startsWith("fa")) {
		companyLikes = ["番禺"]
	} else if (input.startsWith("su")) {
		companyLikes = ["苏州"]
	} else if (input.startsWith("ku")) {
		companyLikes = ["昆山"]
	} else if (input.startsWith("na")) {
		companyLikes = ["南京", "南昌"]
	} else if (input.startsWith("zh")) {
		companyLikes = ["郑州", "中山"]
	} else if (input.startsWith("wu")) {
		companyLikes = ["武汉", "无锡"]
	} else if (input.startsWith("qu")) {
		companyLikes = ["泉州"]
	} else if (input.startsWith("qi")) {
		companyLikes = ["青岛"]
	} else if (input.startsWith("hu")) {
		companyLikes = ["葫芦岛"]
	} else if (input.startsWith("ba")) {
		companyLikes = ["保定"]
	} else if (input.startsWith("he")) {
		companyLikes = ["合肥"]
	} else if (input.startsWith("ti")) {
		companyLikes = ["天津"]
	} else if (input.startsWith("fu")) {
		companyLikes = ["福州"]
	} else {
		companyLikes = [input]
	}
	for (const companyLike of companyLikes) {
		if (option.props.children.indexOf(companyLike) >= 0) {
			return true
		}
	}
	return false
}
