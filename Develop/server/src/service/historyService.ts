import fs from 'fs';
// TODO: Define a City class with name and id properties

class City {
  name: string;
  id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }};

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    return new Promise((resolve, reject) => {
      fs.readFile('searchHistory.json', 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        fs.writeFile('searchHistory.json', JSON.stringify(cities), (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const data = await this.read();
    const cities = JSON.parse(data as string);
    return cities;
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities = await this.getCities();
    const id = cities.length.toString();
    cities.push(new City(city, id));
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();
