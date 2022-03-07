const axios = require("axios");
const moment = require("moment");
var handlebars = require("handlebars");
const pdf = require("html-pdf");
const main = async () => {
	let list = await axios
		.post("http://lejnet/api/csnet/web-order")
		.then((res) => {
			let date_cols = ["OH_DATE_ENTERED", "OH_DATE_ORDERED", "OH_DT_LST_MOD"];
			return res.data.map((val) => {
				//初期整形処理
				for (let key in val) {
					// "null"は空文字へ
					if (val[key] == "null" || !val[key]) {
						val[key] = "";
						continue;
					}
					//余分な空白を除去。日付型はフォーマット
					if (date_cols.includes(key)) {
						val[key] = moment(new Date(val[key])).format("YYYY/MM/DD");
					} else {
						val[key] = val[key].replace(/\s+/g, "");
					}
				}
				return val;
			});
		});
	//HTML整形処理
	let html, header, body;
	// header
	let cols = Object.keys(list[0]);
	header = cols.reduce((a, b) => {
		return a + "<th>" + b + "</th>";
	}, "");
	header = "<thead><tr>" + header + "</tr></thead>";
	// body
	let tmp;
	for (let item of list) {
		for (key in item) {
			if (item[key] != undefined) {
				tmp += "<td>" + item[key] + "</td>";
			} else {
				tmp += "<td></td>";
			}
		}
		body += "<tr>" + tmp + "</tr>";
		tmp = "";
	}
	body = "<tbody>" + body + "</tbody>";

	let style = `<style>
                    html, body {
                        margin: 0;
                        padding: 0;
                        font-size: 12px;
                        background: rgb(50,50,50);
                        -webkit-print-color-adjust: exact;
                        box-sizing: border-box;
                    }
                    .page {
                        position: relative;
                        width: 172mm;
                        display: block;
                        background: white;
                        color: black;
                        page-break-after: auto;
                        margin: 50px;
                        overflow: hidden;
                    }
                    @media print {
                        html, body {
                            background: white;
                        }
                        .page {
                            margin: 0;
                            height: 100%;
                            width: 100%;
                        }
                    }
                    .main {
                        margin: 10px;
                    }
										thead{
											font-size:9px;
											overflow: hidden;
										}
                    table, td {
                        border: 1px solid gray;
                    }      
                    td {
											  font-size:9px;
                        padding: 5px;
                    }        
                    table {
                        border-collapse: collapse;
                        width:297mm;
												table-layout: fixed;
                    }
                </style>`;

	html = `
	<!DOCTYPE html>
	<html lang="ja">
			<head>
				<meta charset="utf8">
				${style}
			</head>
			<body>
			<h2 style="text-align:center">Web Order List</h2>
				<div class="page">
					<table>
						${header}
						${body}
					</table>
				</div>
			</body>
		</html>`;

	const options = {
		format: "A4", // 用紙のサイズを指定
		orientation: "landscape", // 用紙の向きを指定
		// ヘッダ部のテンプレートを指定
		header: {
			height: "28mm",
			contents: `
			<div style="text-align: right; padding-top: 40px; padding-right: 40px;">
			<div>発行日: ${moment().format("YYYY/MM/DD")}</div>
            <div>{{page}} / {{pages}} ページ</div>
        </div>`,
		},
	};

	const conHtml = handlebars.compile(html)({ template: "HBS" });
	const filePath = "../src/pdf/test.pdf";
	pdf.create(conHtml, options).toFile(filePath, (err, res) => {
		if (err) reject(err);

		console.log(res);
	});

	//console.log(html);
	return;
};

exports.main = main;
