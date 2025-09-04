import { ReactElement, JSXElementConstructor, ReactNode, AwaitedReactNode, Key } from "react"
import { useGetUserNotifications } from "../hooks/useGetUserNotifications"

export const NotificationsWrapper = () => {

  const {data, isLoading} = useGetUserNotifications()

  console.log(data, 'data')


  return (
    <div>
      
      {data?.items?.map((item: any) => (
        <p key={item.event}>{item.event}</p>
      ))}
    </div>
  )
}