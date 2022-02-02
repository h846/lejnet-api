var express = require("express");
var router = express.Router();
const ExcelJS = require("exceljs");
const axios = require("axios");
const moment = require("moment");

router.get("/", function (req, res, next) {
	res.send("it works");
});
/* Web Order Tracking */
router.get("/wo-tracking", async function (req, res, next) {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet("WO Tracking");

	// list shaping process
	let list = await axios
		.post("http://lejnet/api/csnet/web-order")
		.then((res) => {
			let webOrdData = res.data;
			let date_cols = ["OH_DATE_ENTERED", "OH_DATE_ORDERED", "OH_DT_LST_MOD"];
			webOrdData = webOrdData.map((val) => {
				//初期整形処理
				for (let key in val) {
					//余分な空白を除去。日付型はフォーマット
					if (date_cols.includes(key)) {
						val[key] = moment(val[key]).format("YYYY/MM/DD");
					} else {
						val[key] = val[key].replace(/\s+/g, "");
					}
					// "null"は空文字へ
					if (val[key] == "null") {
						val[key] = "";
					}
				}
				//状況列
				switch (val["OH_STATUS"]) {
					case "P":
						val["OH_STATUS"] = "ピック中";
						break;
					case "B":
						val["OH_STATUS"] = "B/O待ち";
						break;
					case "O":
						val["OH_STATUS"] = "準備済";
						break;
					case "N":
						if (val["OH_HOLD_RSN"] == "" && val["OH_CREDIT_HOLD_RSN"] == "") {
							val["OH_STATUS"] = "新オーダー";
						} else {
							val["OH_STATUS"] = "9止め中";
						}
						break;
				}
				// RAKUGAE列
				if (val.OH_ORDER_TYPE == "R") {
					val.OH_ORDER_TYPE = "Y";
				} else {
					val.OH_ORDER_TYPE = "";
				}

				if (val.OH_DT_LST_MOD == "Invalid date") {
					val.OH_DT_LST_MOD = "";
				}

				//9止理由列
				val.OH_HOLD_RSN += "\n" + val.OH_CREDIT_HOLD_RSN;

				return val;
			});

			return webOrdData;
		});

	list.sort((a, b) => a.OH_DATE_ORDERED - b.OH_DATE_ORDERED);

	worksheet.columns = [
		{ header: "オーダー日付", key: "order_date", width: 15 },
		{ header: "時間", key: "time", width: 15 },
		{ header: "受付番号", key: "recept_num", width: 15 },
		{ header: "状況", key: "status", width: 15 },
		{ header: "9止め理由", key: "nine_stop", width: 15 },
		{ header: "氏名", key: "name", width: 15 },
		{ header: "C#", key: "cust_num", width: 15 },
		{ header: "O#", key: "order_num", width: 15 },
		{ header: "CODE", key: "code", width: 15 },
		{ header: "楽替", key: "rakugae", width: 15 },
		{ header: "CSR_ID", key: "csr_id", width: 15 },
		{ header: "UPDATER", key: "updater", width: 15 },
		{ header: "更新日", key: "last_update", width: 15 },
	];

	for (let row of list) {
		worksheet.addRow({
			order_date: row.OH_DATE_ORDERED,
			time: row.OH_ORDER_TIME,
			recept_num: row.OH_PO_NUMBER,
			recept_time: row.OH_DATE_ENTERED,
			status: row.OH_STATUS,
			nine_stop: row.OH_HOLD_RSN + row.OH_CREDIT_HOLD_RSN,
			name: row.OH_BILL_NAME,
			cust_num: row.OH_CUSTOMER_NUMBER,
			order_num: row.OH_ORDER_NUMBER,
			code: row.OH_CAMPAIGN_CODE,
			rakugae: row.OH_ORDER_TYPE,
			csr_id: row.OH_ORDER_TAKER,
			updater: row.OH_USR_LST_MOD,
			last_update: row.OH_DT_LST_MOD,
		});
	}
	//Style
	/** ヘッダ行の背景色 */
	const headerFillStyle = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "FFDDDDDD" },
	};
	/** ヘッダ行のフォント */
	const headerFontStyle = {
		name: "Yu Gothic",
		bold: true,
	};
	//すべての行を走査
	worksheet.eachRow((row, rowNumber) => {
		//すべてのセルを走査
		row.eachCell((cell, cellNumber) => {
			if (rowNumber === 1) {
				//ヘッダ行のスタイルを設定
				cell.fill = headerFillStyle;
				cell.font = headerFontStyle;
			} else {
				cell.font = { name: "Yu Gothic" };
			}
		});
		row.commit();
	});

	console.log(list);

	workbook.xlsx.writeFile("excelFiles/web_order.xlsx");

	res.status(200).send("Excel file creation completed.");
});

module.exports = router;
