import withWorker from './gameWithWorker'
import withoutWorker from './gameWithoutWorker'

const main = () => {
  Promise.all([withoutWorker(), withWorker()]).then(res => {
    //@ts-ignore
    res[0]()
    //@ts-ignore
    res[1]()

    setTimeout(() => {
      const interval = setInterval(jank, 1000 / 60)
      setTimeout(() => {
        clearInterval(interval)
      }, 15000)
    }, 500)
  })
}

main()

const jank = () => {
  var number = 0

  for (var i = 0; i < 1000000; i++) {
    number += Math.random()
  }
}
