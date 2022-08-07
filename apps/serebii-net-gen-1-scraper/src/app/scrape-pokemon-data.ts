import {
  assertType,
  MoveTableEntity,
  PokemonTableEntity,
  Type,
} from '@pokemon-supabase-example/pokemon-db';
import { Builder, By, WebDriver, WebElement } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

export async function scrapePokemonData(id: number) {
  const url = `https://www.serebii.net/pokedex/${padLeadingZeros(id)}.shtml`;
  const driver = await createDriver();
  await driver.get(url);
  const image_url = `https://serebii.net${await driver
    .findElement(By.css('#sprite-rb'))
    .getAttribute('src')}`;
  const name = await driver
    .findElement(By.css('table.dextable:nth-child(5) .fooinfo'))
    .getText();
  const type1 = await getType1(driver);
  const type2 = await getType2(driver);
  const classification = await driver
    .findElement(
      By.css(
        'table.dextable:nth-child(5) tr:nth-child(4) .fooinfo:nth-child(1)'
      )
    )
    .getText();
  const height = await getHeight(driver);
  const weight = await getWeight(driver);
  let stats: any;
  const possibleStatsRows = [18, 17, 22, 23, 19, 21];
  for (const row of possibleStatsRows) {
    try {
      stats = await getStats(driver, row);
      break;
    } catch (e) {
      console.log(`Couldn't get stats for ${name} at row ${row}...`);
    }
  }
  if (!stats) {
    throw new Error(`Could not find stats for pokemon ${name}`);
  }
  const capture_rate = +(await driver
    .findElement(
      By.css(
        'table.dextable:nth-child(5) > tbody > tr:nth-child(4) td:nth-child(4)'
      )
    )
    .getText());
  const pokemon: PokemonTableEntity = {
    id: `${id}`,
    image_url,
    name,
    type1,
    type2,
    classification,
    height,
    weight,
    capture_rate,
    ...stats,
  };
  //   console.log(pokemon);
  const levelingMoves = await getLevelingMoveData(driver);
  //   console.log(levelingMoves);
  const itemMoves = await getItemMoveData(driver);
  driver.close();
  //   console.log(itemMoves);
  return {
    pokemon,
    levelingMoves,
    itemMoves,
  };
}

async function createDriver(headless = true) {
  if (headless) {
    return await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(
        new Options()
          .headless()
          .windowSize({
            width: 640,
            height: 480,
          })
          .addArguments('--no-sandbox')
      )
      .build();
  }
  return await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(
      new Options()
        .addArguments('--no-sandbox', '--disable-dev-shm-usage')
        .windowSize({
          width: 1150,
          height: 870,
        })
    )
    .build();
}

async function getType1(driver: WebDriver): Promise<Type> {
  const element = await driver.findElement(
    By.css('table.dextable:nth-child(5) .cen a:nth-child(1)')
  );
  return await getTypeFromLinkElement(element);
}

async function getType2(driver: WebDriver): Promise<Type | undefined> {
  try {
    const element = await driver.findElement(
      By.css('table.dextable:nth-child(5) .cen a:nth-child(2)')
    );
    return await getTypeFromLinkElement(element);
  } catch (e) {
    return undefined;
  }
}

async function getTypeFromLinkElement(element: WebElement): Promise<Type> {
  const href = await element.getAttribute('href');
  const type = href.split('/')[4].replace('.shtml', '');
  assertType(type);
  return type;
}

async function getHeight(driver: WebDriver): Promise<number> {
  const element = await driver.findElement(
    By.css('table.dextable:nth-child(5) tr:nth-child(4) .fooinfo:nth-child(2)')
  );
  const text = await element.getText();
  const height = +text.split('\n')[1].replace('m', '');
  return height;
}

async function getWeight(driver: WebDriver): Promise<number> {
  const element = await driver.findElement(
    By.css('table.dextable:nth-child(5) tr:nth-child(4) .fooinfo:nth-child(3)')
  );
  const text = await element.getText();
  const weight = +text.split('\n')[1].replace('kg', '');
  return weight;
}

async function getStats(
  driver: WebDriver,
  statsTableChildCounter = 18
): Promise<{
  base_stat_hp: number;
  base_stat_attack: number;
  base_stat_defense: number;
  base_stat_special: number;
  base_stat_speed: number;
  level_50_min_hp: number;
  level_50_max_hp: number;
  level_50_min_attack: number;
  level_50_max_attack: number;
  level_50_min_defense: number;
  level_50_max_defense: number;
  level_50_min_special: number;
  level_50_max_special: number;
  level_50_min_speed: number;
  level_50_max_speed: number;
  level_100_min_hp: number;
  level_100_max_hp: number;
  level_100_min_attack: number;
  level_100_max_attack: number;
  level_100_min_defense: number;
  level_100_max_defense: number;
  level_100_min_special: number;
  level_100_max_special: number;
  level_100_min_speed: number;
  level_100_max_speed: number;
}> {
  async function getMinMaxForLevel(
    rowNumber: number,
    columnNumber: number
  ): Promise<[number, number]> {
    return (
      await driver
        .findElement(
          By.css(
            `table.dextable:nth-child(${statsTableChildCounter}) tr:nth-child(${rowNumber}) .fooinfo:nth-child(${columnNumber})`
          )
        )
        .getText()
    )
      .split(' - ')
      .map((v) => +v) as [number, number];
  }
  const base_stat_hp = +(await driver
    .findElement(
      By.css(
        `table.dextable:nth-child(${statsTableChildCounter}) tr:nth-child(3) .fooinfo:nth-child(2)`
      )
    )
    .getText());
  const base_stat_attack = +(await driver
    .findElement(
      By.css(
        `table.dextable:nth-child(${statsTableChildCounter}) tr:nth-child(3) .fooinfo:nth-child(3)`
      )
    )
    .getText());
  const base_stat_defense = +(await driver
    .findElement(
      By.css(
        `table.dextable:nth-child(${statsTableChildCounter}) tr:nth-child(3) .fooinfo:nth-child(4)`
      )
    )
    .getText());
  const base_stat_special = +(await driver
    .findElement(
      By.css(
        `table.dextable:nth-child(${statsTableChildCounter}) tr:nth-child(3) .fooinfo:nth-child(5)`
      )
    )
    .getText());
  const base_stat_speed = +(await driver
    .findElement(
      By.css(
        `table.dextable:nth-child(${statsTableChildCounter}) tr:nth-child(3) .fooinfo:nth-child(6)`
      )
    )
    .getText());
  const [level_50_min_hp, level_50_max_hp] = await getMinMaxForLevel(4, 3);
  const [level_50_min_attack, level_50_max_attack] = await getMinMaxForLevel(
    4,
    4
  );
  const [level_50_min_defense, level_50_max_defense] = await getMinMaxForLevel(
    4,
    5
  );
  const [level_50_min_special, level_50_max_special] = await getMinMaxForLevel(
    4,
    6
  );
  const [level_50_min_speed, level_50_max_speed] = await getMinMaxForLevel(
    4,
    7
  );
  const [level_100_min_hp, level_100_max_hp] = await getMinMaxForLevel(5, 2);
  const [level_100_min_attack, level_100_max_attack] = await getMinMaxForLevel(
    5,
    3
  );
  const [level_100_min_defense, level_100_max_defense] =
    await getMinMaxForLevel(5, 4);
  const [level_100_min_special, level_100_max_special] =
    await getMinMaxForLevel(5, 5);
  const [level_100_min_speed, level_100_max_speed] = await getMinMaxForLevel(
    5,
    6
  );
  return {
    base_stat_hp,
    base_stat_attack,
    base_stat_defense,
    base_stat_special,
    base_stat_speed,
    level_50_min_hp,
    level_50_max_hp,
    level_50_min_attack,
    level_50_max_attack,
    level_50_min_defense,
    level_50_max_defense,
    level_50_min_special,
    level_50_max_special,
    level_50_min_speed,
    level_50_max_speed,
    level_100_min_hp,
    level_100_max_hp,
    level_100_min_attack,
    level_100_max_attack,
    level_100_min_defense,
    level_100_max_defense,
    level_100_min_special,
    level_100_max_special,
    level_100_min_speed,
    level_100_max_speed,
  };
}

async function getLevelingMoveData(
  driver: WebDriver
): Promise<(MoveTableEntity & { level: number | undefined })[]> {
  const rowElements = await driver.findElements(
    By.css('table.dextable:nth-child(13) tr')
  );
  const moveData: (MoveTableEntity & { level: number | undefined })[] = [];
  for (let i = 2; i < rowElements.length; i = i + 2) {
    const firstRowElement = rowElements[i];
    const [
      levelCell,
      nameCell,
      typeCell,
      powerCell,
      accuracyCell,
      ppCell,
      effect_percentageCell,
    ] = await firstRowElement.findElements(By.css('td'));
    const level = (await levelCell.getText()).includes('-')
      ? undefined
      : +(await levelCell.getText());
    const name = await nameCell.getText();
    const type = (await typeCell.findElement(By.css('img')).getAttribute('src'))
      .split('/')[5]
      .split('.')[0];
    assertType(type);
    const attack =
      (await powerCell.getText()) === '--' ||
      (await powerCell.getText()) === '??'
        ? undefined
        : +(await powerCell.getText());
    const accuracy =
      (await accuracyCell.getText()) === '--'
        ? undefined
        : +(await accuracyCell.getText());
    const power_points = +(await ppCell.getText());
    const effect_percentage =
      (await effect_percentageCell.getText()) === '--'
        ? undefined
        : +(await effect_percentageCell.getText());
    const secondRowElement = rowElements[i + 1];
    const descriptionCell = await secondRowElement.findElement(By.css('td'));
    const description = await descriptionCell.getText();
    moveData.push({
      level,
      name,
      type,
      attack,
      accuracy,
      power_points,
      effect_percentage,
      description,
      id: `MOVE_${name.toUpperCase().split(' ').join('_')}`,
    });
  }
  return moveData;
}

async function getItemMoveData(
  driver: WebDriver
): Promise<(MoveTableEntity & { item_name: string })[]> {
  try {
    const rowElements = await driver.findElements(
      By.css('table.dextable:nth-child(14) tr')
    );
    const moveData: (MoveTableEntity & { item_name: string })[] = [];
    for (let i = 2; i < rowElements.length; i = i + 2) {
      const firstRowElement = rowElements[i];
      const [
        itemCell,
        nameCell,
        typeCell,
        powerCell,
        accuracyCell,
        ppCell,
        effect_percentageCell,
      ] = await firstRowElement.findElements(By.css('td'));
      const item_name = await itemCell.getText();
      const name = await nameCell.getText();
      const type = (
        await typeCell.findElement(By.css('img')).getAttribute('src')
      )
        .split('/')[5]
        .split('.')[0];
      assertType(type);
      const attack =
        (await powerCell.getText()) === '--' ||
        (await powerCell.getText()) === '??'
          ? undefined
          : +(await powerCell.getText());
      const accuracy =
        (await accuracyCell.getText()) === '--'
          ? undefined
          : +(await accuracyCell.getText());
      const power_points = +(await ppCell.getText());
      const effect_percentage =
        (await effect_percentageCell.getText()) === '--'
          ? undefined
          : +(await effect_percentageCell.getText());
      const secondRowElement = rowElements[i + 1];
      const descriptionCell = await secondRowElement.findElement(By.css('td'));
      const description = await descriptionCell.getText();
      moveData.push({
        item_name,
        name,
        type,
        attack,
        accuracy,
        power_points,
        effect_percentage,
        description,
        id: `MOVE_${name.toUpperCase().split(' ').join('_')}`,
      });
    }
    return moveData;
  } catch (e) {
    return [];
  }
}

function padLeadingZeros(value: number): string {
  if (value >= 100) {
    return value.toString();
  }
  if (value >= 10) {
    return `0${value}`;
  }
  return `00${value}`;
}
