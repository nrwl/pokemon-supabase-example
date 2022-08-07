import { BehaviorSubject, filter, tap } from 'rxjs';

export async function parallelPromiseWithConcurrency<T>(
  promiseFactories: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> {
  const startedIndexes: number[] = [];
  const processedIndexes: number[] = [];
  const results: any[] = [];
  const indexesInProgress = new BehaviorSubject<number[]>([]);
  const effects = indexesInProgress.pipe(
    filter(({ length }) => length < concurrency),
    tap(async (indexes) => {
      if (indexes.length < concurrency) {
        const nextIndex = getNextIndex(startedIndexes);
        startedIndexes.push(nextIndex);
        indexesInProgress.next([...indexes, nextIndex]);
        if (promiseFactories[nextIndex]) {
          let result;
          while (!result) {
            try {
              result = await promiseFactories[nextIndex]();
            } catch (e) {
              console.error('failed... retrying');
            }
          }
          processedIndexes.push(nextIndex);
          results[nextIndex] = result;
          const newArr = [...indexesInProgress.value].filter(
            (x) => x !== nextIndex
          );
          console.log(
            `COMPLETED SCRAPPING FOR ${processedIndexes.length} OF ${promiseFactories.length} LINKS`
          );
          indexesInProgress.next(newArr);
        }
      }
    })
  );
  const getNextIndex = (arr: number[]) => {
    let i = 0;
    while (arr.includes(i)) {
      i++;
    }
    return i;
  };
  const promise = new Promise<any[]>((resolve) => {
    effects.subscribe(() => {
      if (processedIndexes.length === promiseFactories.length) {
        resolve(results);
      }
    });
  });
  return await promise;
}
