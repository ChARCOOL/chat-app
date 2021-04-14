import { useRouter } from 'next/router'
import { Card, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { LoginOutlined, UserAddOutlined, SettingOutlined } from '@ant-design/icons'

const Home = () => {
  const router = useRouter()

  return (
    <div className="flex justify-center items-center w-screen h-screen absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Card className="w-10/12 h-5/6 flex flex-col justify-center items-center">
        <div className="relative -top-28">
          <p className="text-3xl font-bold font-mono">Welcome</p>
        </div>
        <List className="w-80">
          <ListItem
            button
            onClick={() => router.push('/login', null, { shallow: true })}
            style={{ borderBottom: '1px solid #9c9c9c' }}
          >
            <ListItemText>Log in</ListItemText>
            <ListItemIcon>
              <LoginOutlined />
            </ListItemIcon>
          </ListItem>
          <ListItem
            button
            onClick={() => router.push('/register', null, { shallow: true })}
            style={{ borderBottom: '1px solid #9c9c9c', marginTop: '15px' }}
          >
            <ListItemText>Register</ListItemText>
            <ListItemIcon>
              <UserAddOutlined />
            </ListItemIcon>
          </ListItem>
          <ListItem
            button
            onClick={() => router.push('/troubleshoot', null, { shallow: true })}
            style={{ borderBottom: '1px solid #9c9c9c', marginTop: '15px' }}
          >
            <ListItemText>Troubleshoot</ListItemText>
            <ListItemIcon>
              <SettingOutlined />
            </ListItemIcon>
          </ListItem>
        </List>
      </Card>
    </div>
  )
}

export default Home
