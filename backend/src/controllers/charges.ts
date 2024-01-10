import csv from "csv-parser";
import { Request, Response } from "express";
import fs from "fs";

const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "June",
  "July", "Aug", "Sept", "Oct", "Nov", "Dec"
];

export const getCharges = (req: Request, res: Response) => {
  let index = 0;
  const results: any = [];
  const limit: number = parseInt((req.query.limit as string) || "10");
  const skip: number =
    (parseInt((req.query.skip as string) || "100") - 1) * limit;
  let mmr: any = {};
  let churn: any = {};
  const quantities: any = [];

  const path = req.file?.path || "";

  fs.createReadStream(path)
    .pipe(csv())
    .on("data", (data: any) => {
      const month = data["data status"].split("/")[0];
      const chargeMonth =
        parseFloat(data["valor"].replace(",", ".")) *
        parseInt(data["quantidade cobranças"]);
      quantities.push(parseInt(data["quantidade cobranças"]));

      if(data["status"] === 'Ativa')
        mmr[month] = mmr[month] ? mmr[month] + chargeMonth : chargeMonth;
      else if(data["status"] === 'Cancelada')
        churn[month] = churn[month] ? churn[month] + chargeMonth : chargeMonth;

      if (index >= skip && index < skip + limit) results.push(data);
      index++;
    })
    .on("end", () => {
      mmr = Object.keys(mmr).map(key=>Object.assign({date: monthNames[parseInt(key)], amount: mmr[key]}));
      churn = Object.keys(churn).map(key=>Object.assign({date: monthNames[parseInt(key)], amount: churn[key]}));
      res.json({ data: results, skip: req.query.skip, limit, mmr, churn, quantities });
    });
};
