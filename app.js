const request = require("request");

const getWeather = (location) => {
  const access_key = "1d30386899msh20c1a7d2e766861p161a0ajsne2cfb35a25b4";
  const options = {
    method: "GET",
    url: "https://weatherapi-com.p.rapidapi.com/current.json",
    qs: { q: `${location}` },
    headers: {
      "X-RapidAPI-Key": `${access_key}`,
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
        return;
      }
      const data = JSON.parse(body);
      const weather = {
        isSuccess: true,
        region: data.location.region,
        country: data.location.country,
        temperature: data.current.temp_c,
        wind_speed: data.current.wind_kph,
        precip: data.current.precip_mm,
        cloudcover: data.current.cloud,
      };
      resolve(weather);
    });
  });
};
//getWeather("Tokyo");

const express = require("express");
// setup static file
// static file giúp chúng ta cài đặt một đường dẫn để truy xuất tới các file như css, js, image, pdf, ...
const path = require("path");

// tạo server bằng express
const app = express();
// __dirname: đường dẫn tới file đang code
const pathPublic = path.join(__dirname, "./public");
// app.use: setup một tính năng cho project
// express.static dùng để setup đường dẫn static cho project
app.use(express.static(pathPublic));

// dùng công nghệ hbs hoặc pug--> npm install hbs
app.set("view engine", "hbs");

// khi truy cập vào http://localhost:7000/ --> hàm này được chạy
app.get("/", async (req, res) => {
  const location = req.query.address;
  const weather = await getWeather(location);
  console.log(weather);

  if (location) {
    res.render("weather", {
      status: true,
      region: weather.region,
      country: weather.country,
      temperature: weather.temperature,
      wind_speed: weather.wind_speed,
      precip: weather.precip,
      cloudcover: weather.cloudcover,
    });
  } else {
    res.render("weather", {
      status: false,
    });
  }
});

// app lắng nghe tại PORT nào
const PORT = 7000;
app.listen(PORT, () => {
  console.log(`App runs on http://localhost:${PORT}`);
});
