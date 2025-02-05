interface IProps {
  params: {
    id: string;
  };
}

async function CoverLetterDetailPage({ params }: IProps) {
  const id = params.id;
  return <div>CoverLetterPage {id}</div>;
}

export default CoverLetterDetailPage;
