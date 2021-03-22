package methods

// UserID is used to discriminate users in database
type UserID uint

// StudentID is equivalent to UserID in context of student's methods
type StudentID UserID

// TeacherID is equivalent to UserID in context of teacher's methods
type TeacherID UserID

// AuthToken is used as a cookie authorization-potent value
type AuthToken uint
