import withWorker from './gameWithWorker'
import withoutWorker from './gameWithoutWorker'

const main = () => {
  Promise.all([withoutWorker(), withWorker()]).then(res => {
    //@ts-ignore
    //res[0]()
    //@ts-ignore
    res[1]()
  })
}

main()
