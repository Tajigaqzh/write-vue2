const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
// 他匹配到的分组是一个 标签名  <xxx 匹配到的是开始 标签的名字
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
// 匹配的是</xxxx>  最终匹配到的分组就是结束标签的名字
const attribute =
	/^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性
// 第一个分组就是属性的key value 就是 分组3/分组4/分组五
const startTagClose = /^\s*(\/?)>/; // <div> <br/>

//验证正则网址https://regexper.com/

/**
 *
 * {
 * tag:'div',//标签名
 * type:1,//元素类型
 * attrs:[{name,age,address}],//记录属性
 * parent:null,//记录父节点
 * children:[]
 * }
 */

// 对模板进行编译处理
export function parseHTML(html) {
	// html最开始肯定是一个  </div>

	const ELEMENT_TYPE = 1; //标签
	const TEXT_TYPE = 3; //文本
	const stack = []; // 用于存放元素的栈
	let currentParent; // 指向的是栈中的最后一个
	let root; // 树的根节点

	//循环解析html
	while (html) {
		// 如果textEnd 为0 说明是一个开始标签或者结束标签
		// 如果textEnd > 0说明就是文本的结束位置
		let textEnd = html.indexOf("<"); // 如果indexOf中的索引是0 则说明是个标签
		if (textEnd == 0) {
			const startTagMatch = parseStartTag(); // 开始标签的匹配结果
			if (startTagMatch) {
				// 解析到的开始标签
				start(startTagMatch.tagName, startTagMatch.attrs);
				continue;
			}
			//匹配结束标签
			let endTagMatch = html.match(endTag);
			if (endTagMatch) {
				advance(endTagMatch[0].length);
				//end
				end(endTagMatch[1]);
				continue;
			}
		}
		// 如果不是0 说明是文本
		if (textEnd > 0) {
			let text = html.substring(0, textEnd); // 文本内容
			if (text) {
				chars(text);
				advance(text.length);
				// 删除解析过的文本
			}
		}
	}
	//解析开始标签
	function parseStartTag() {
		const start = html.match(startTagOpen);
		if (start) {
			const match = {
				tagName: start[1], // 标签名
				attrs: [],
			};
			//删除解析过的标签，前进
			advance(start[0].length);

			// 如果不是开始标签的结束 就一直匹配下去
			let attr, end;
			while (
				!(end = html.match(startTagClose)) &&
				(attr = html.match(attribute))
			) {
				//删除解析过的属性，前进
				advance(attr[0].length);
				match.attrs.push({
					name: attr[1],
					value: attr[3] || attr[4] || attr[5] || true,
				});
			}
			if (end) {
				//删掉开始标签的>
				advance(end[0].length);
			}
			return match;
		}
		return false; // 不是开始标签
	}

	// 利用栈型结构 来构造一颗树
	//栈中的最后一个元素是当前匹配到开始标签的父亲
	function start(tag, attrs) {
		//匹配到开始标签，创建一个栈
		let node = createASTElement(tag, attrs); // 创造一个ast节点
		if (!root) {
			// 看一下是否是空树
			root = node; // 如果为空则当前是树的根节点
		}
		if (currentParent) {
			node.parent = currentParent; // 只赋予了parent属性
			currentParent.children.push(node); // 还需要让父亲记住自己
		}
		//放入栈中
		stack.push(node);
		currentParent = node; // currentParent为栈中的最后一个
	}
	//解析文本
	function chars(text) {
		// 文本直接放到当前指向的节点中
		text = text.replace(/\s/g, " "); // 如果空格超过2就删除2个以上的
		text &&
			currentParent.children.push({
				type: TEXT_TYPE,
				text,
				parent: currentParent,
			});
	}
	//解析结束标签
	function end(tag) {
		let node = stack.pop(); // 弹出最后一个, 利用node还可以校验标签是否合法
		currentParent = stack[stack.length - 1];
	}
	//删除解析过的标签
	function advance(n) {
		html = html.substring(n);
	}

	//最终需要转化成一颗抽象语法树
	function createASTElement(tag, attrs) {
		return {
			tag,
			type: ELEMENT_TYPE,
			children: [],
			attrs,
			parent: null,
		};
	}

	return root;
}
