const fs = require("fs");

for (let i = 0; i < 40; i++) {
  fs.readFile(`./../artworks/attributes/${i}.json`, "utf8", (err, data) => {
    if (err) {
      console.log(`Error reading file from disk: ${err}`);
    } else {
      const uri = `replace actual image url of ipfs`;
      let new_data = {};
      new_data.name = `CampBuidl #${i}`;
      new_data.edition = i;
      new_data.image = uri;
      new_data.external_url = "";

      const attr_data = JSON.parse(data);
      new_data.attributes = attr_data.attributes;
      // new_data.attributes.push({
      //   trait_type: "PROMPT",
      //   value: `value${i}`,
      // });
      // new_data.attributes.push({
      //   trait_type: "TEMPERATURE",
      //   value: `value${i}`,
      // });
      // new_data.attributes.push({
      //   trait_type: "MODEL",
      //   value: `value${i}`,
      // });
      new_data.attributes;
      fs.writeFile(
        `./../artworks/metadatas/${i}`,
        JSON.stringify(new_data, null, 4),
        (err) => {
          if (err) {
            console.log(`Error writing file: ${err}`);
          }
        }
      );
    }
  });
}
