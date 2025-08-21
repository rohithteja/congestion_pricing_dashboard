// Client-side data service for static deployment
export class StaticDataService {
  private static baseUrl = '';

  static async getCities(): Promise<string[]> {
    // Return hardcoded list of cities
    return [
      'delhi', 'mumbai', 'bengaluru', 'hyderabad', 'ahmedabad', 'chennai', 'kolkata', 
      'pune', 'surat', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'bhopal',
      'patna', 'ghaziabad', 'vishakhapatnam', 'thiruvananthapuram', 'agra', 'varanashi',
      'vadodara', 'faridabad', 'ludhiana', 'nashik', 'madurai', 'coimbatore', 'jamshedpur',
      'gwalior', 'ranchi', 'aurangabad', 'moradabad', 'rajkot', 'noida', 'kota',
      'bareilly', 'raipur', 'amritsar', 'guwahati', 'jalandhar', 'gurgaon', 'tiruchirappalli',
      'solapur', 'kochi', 'hubli dharwad', 'jodhpur', 'aligarh', 'vijaywada', 'bhubaneswar',
      'srinagar', 'jammu', 'mysuru', 'warangal', 'cuttack', 'chandigarh', 'tiruppur',
      'firozabad', 'guntur', 'dehradun', 'amravati', 'patiala', 'mangaluru', 'jhansi',
      'bhilainagar', 'jalgaon', 'nellore', 'gaya', 'sangli-miraj-kupwad', 'agartala',
      'kolhapur', 'ujjain', 'muzaffarpur', 'erode', 'udaipur', 'silchar', 'alwar',
      'korba', 'jalpaiguri', 'kurnool', 'shivamogga', 'thoothukkudi', 'jabalpur',
      'sagar', 'haldia', 'aizawl', 'dewas', 'durgapur', 'siliguri', 'rourkela',
      'imphal', 'shimla', 'nalgonda', 'shilong', 'gangtok', 'itanagar', 'panaji', 'kohima'
    ];
  }

  static async getCityData(cityName: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/data/${cityName}/data.json`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error(`Error loading city data for ${cityName}:`, error);
      return null;
    }
  }

  static async getCitiesByPopulation(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/data/others/df_static.csv`);
      const csvText = await response.text();
      
      // Simple CSV parsing
      const lines = csvText.split('\n');
      const headers = lines[0].split(',');
      const cities = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',');
          const city: any = {};
          headers.forEach((header, index) => {
            city[header.trim()] = values[index]?.trim();
          });
          return city;
        })
        .filter(city => city.city)
        .map(city => ({
          name: city.city.toLowerCase(),
          display_name: city.city,
          population: parseInt(city.population_2020 || '0'),
          state: city.state,
          coordinates: this.getCityCoordinates(city.city.toLowerCase())
        }))
        .filter(city => city.coordinates)
        .sort((a, b) => b.population - a.population);

      return cities;
    } catch (error) {
      console.error('Error loading cities by population:', error);
      return [];
    }
  }

  private static getCityCoordinates(cityName: string): [number, number] | null {
    const coordinates: { [key: string]: [number, number] } = {
      'delhi': [28.6139, 77.2090],
      'mumbai': [19.0760, 72.8777],
      'bengaluru': [12.9716, 77.5946],
      'hyderabad': [17.3850, 78.4867],
      'ahmedabad': [23.0225, 72.5714],
      'chennai': [13.0827, 80.2707],
      'kolkata': [22.5726, 88.3639],
      'pune': [18.5204, 73.8567],
      'surat': [21.1702, 72.8311],
      'jaipur': [26.9124, 75.7873],
      'lucknow': [26.8467, 80.9462],
      'kanpur': [26.4499, 80.3319],
      'nagpur': [21.1458, 79.0882],
      'indore': [22.7196, 75.8577],
      'bhopal': [23.2599, 77.4126],
      // Add more cities as needed...
    };
    return coordinates[cityName] || null;
  }

  static async getCityStats(cityName: string): Promise<any> {
    const cityData = await this.getCityData(cityName);
    if (!cityData) return null;

    return {
      co2: cityData.baseline_stats?.co2 || 0,
      nox: cityData.baseline_stats?.nox || 0,
      pm25: cityData.baseline_stats?.pm25 || 0
    };
  }

  static async applyPolicy(cityName: string, policy: any): Promise<any> {
    const cityData = await this.getCityData(cityName);
    if (!cityData) throw new Error('City not found');

    // Simple client-side policy calculation
    const reductionFactor = (policy.pricing_intensity || 50) / 100 * 0.3; // Max 30% reduction
    const baseline = cityData.baseline_stats;

    return {
      city: cityName,
      baseline_emissions: baseline,
      post_policy_emissions: {
        co2: baseline.co2 * (1 - reductionFactor),
        nox: baseline.nox * (1 - reductionFactor),
        pm25: baseline.pm25 * (1 - reductionFactor)
      },
      emission_reduction: {
        co2: baseline.co2 * reductionFactor,
        nox: baseline.nox * reductionFactor,
        pm25: baseline.pm25 * reductionFactor
      },
      affected_roads: policy.selected_roads || [],
      policy_settings: policy
    };
  }
}
