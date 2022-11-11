import axios from "axios";

export type WeatherType = {
    data: {
        coord: { lon: number, lat: number },
        weather: {
            id: number,
            main: string,
            description: string,
            icon: string
        }[],
        base: string,
        main: {
            temp: number,
            feels_like: number,
            temp_min: number,
            temp_max: number,
            pressure: number,
            humidity: number,
            sea_level: number,
            grnd_level: number
        },
        visibility: number,
        wind: { speed: number, deg: number, gust: number },
        clouds: { all: number },
        dt: number,
        sys: {
            type: number,
            id: number,
            country: string,
            sunrise: number,
            sunset: number
        },
        timezone: number,
        id: number,
        name: string,
        cod: number
    }
}

export const getWeather = async (city: string) => {

    const token = '96ff54524d7aabb47d873b76ff04f781';
    if (!token) {
        throw new Error('Не задан ключ API, задайте его через команду -t [API_KEY]');
    }
    const response: WeatherType = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
            q: city,
            appid: token,
            lang: 'ru',
            units: 'metric'
        }
    })
    return response.data;
};