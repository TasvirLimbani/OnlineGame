interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Shell({ children, className, ...props }: ShellProps) {
  return (
    <div className="container space-y-8 pb-10 pt-6" {...props}>
      {children}
    </div>
  )
}