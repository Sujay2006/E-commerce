import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

function CommonForm({ formControls, formData, setFormData, onSubmit, buttonText ,isBtnDisabled}) {
    function renderInputByComponentType(getcontrolItem) {
        let element = null;
        const value = formData[getcontrolItem.name] || ''
        switch (getcontrolItem.componentType) {
            case "input":
                element = (
                    <Input
                        name={getcontrolItem.name}
                        placeholder={getcontrolItem.placeholder}
                        id={getcontrolItem.name}
                        type={getcontrolItem.type}
                        value={value}
                        onChange={event => setFormData({
                            ...formData,
                            [getcontrolItem.name]: event.target.value
                        })}
                    />
                );
                break;
            case "select":
                element = (
                    <Select
                        onValueChange={(value) =>
                            setFormData({
                                ...formData,
                                [getcontrolItem.name]: value,
                            })
                        }
                        value={value}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={getcontrolItem.label} />
                        </SelectTrigger>
                        <SelectContent>
                            {getcontrolItem.options && getcontrolItem.options.length > 0
                                ? getcontrolItem.options.map((optionItem) => (
                                    <SelectItem key={optionItem.id} value={optionItem.id}>
                                        {optionItem.label}
                                    </SelectItem>
                                ))
                                : null}
                        </SelectContent>
                    </Select>

                );
                break;
            case "textarea":
                element = (
                    <Textarea
                        name={getcontrolItem.name}
                        placeholder={getcontrolItem.placeholder}
                        id={getcontrolItem.id}
                        value={value}
                        onChange={event => setFormData({
                            ...formData,
                            [getcontrolItem.name]: event.target.value
                        })}
                    />
                );
                break;
            default:
                element = (
                    <Input
                        name={getcontrolItem.name}
                        placeholder={getcontrolItem.placeholder}
                        id={getcontrolItem.name}
                        type={getcontrolItem.type}
                        value={value}
                        onChange={event => setFormData({
                            ...formData,
                            [getcontrolItem.name]: event.target.value
                        })}
                    />
                );
                break;
        }
        return element;
    }
    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-3">
                {
                    formControls.map(controlItem => <div className="grid w-full gap-1.5" key={controlItem.name}>
                        <Label className="mb-1">{controlItem.label}</Label>
                        {
                            renderInputByComponentType(controlItem)
                        }
                    </div>)
                }
            </div>
            <Button type='submit' disabled={isBtnDisabled} className="mt-2 w-full">{buttonText || "Submit"}</Button>
        </form>
    );
}

export default CommonForm;