import Input from '../Input/Input';

const Converter = ({}) => {
    return (
        <div className="p10 flex">
            <Input
                onClick={() => {
                    console.log('my test');
                }}
                label={'Convert'}
            />
        </div>
    );
};

export default Converter;
