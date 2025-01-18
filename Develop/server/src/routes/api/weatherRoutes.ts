import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // TODO: GET weather data from city name
try {
    const city = req.body.city;
    const weatherData = await WeatherService.getWeatherForCity(city);
    res.json(weatherData);
    // TODO: save city to search history
    try {
      await HistoryService.addCity(city);
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
});
const historyFilePath = path.join(__dirname, '../../data/searchHistory.json');

router.post('/', async (req, res) => {
  try {
    const city = req.body.city;
    const weatherData = await WeatherService.getWeatherForCity(city);
    res.json(weatherData);

    const cityEntry = { id: uuidv4(), city };

    fs.readFile(historyFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const history = data ? JSON.parse(data) : [];
      history.push(cityEntry);

      fs.writeFile(historyFilePath, JSON.stringify(history, null, 2), (err) => {
        if (err) {
          console.error(err);
        }
      });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// TODO: GET search history
router.get('/history', async (req, res) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {});

export default router;
