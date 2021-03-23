package main

const storePath string = "./c/"

// Curriculum is
type Curriculum struct {
	Owner UserID
	ID    CurriculumID
}

const (
	// TestClosed is a test with single input box and closed answering
	TestClosed = iota
	// TestPick is a multiple choice test
	TestPick
	// TestSelect is a single choice test
	TestSelect
)

type TestData struct {
	Tasks []TestTask
}

type TestTask struct {
	Type     uint   // see Type*
	Question string // data that is going to be put in <div>
	Correct  string // parsed in the case of Pick or Select
}

/*
func (c *Curriculum) Synthesize(testid uint) TestData {

}

func (c *Curriculum) Store(testmarkup []byte) error {

}
*/
