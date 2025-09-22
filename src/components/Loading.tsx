interface LoadingProps {
  text?: string
}

export default function Loading({ text = 'Loading...' }: LoadingProps) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      color: 'var(--text-secondary, #6B7280)'
    }}>
      {text}
    </div>
  )
}